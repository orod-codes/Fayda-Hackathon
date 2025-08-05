import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { executeQuery, executeTransaction } from '../database/connection.js';
import { authenticateToken, requireHospitalAdmin, rateLimiter } from '../middleware/auth.js';
import { logRequest } from '../middleware/auth.js';

const router = express.Router();

// Apply middleware
router.use(authenticateToken);
router.use(requireHospitalAdmin);
router.use(rateLimiter(15 * 60 * 1000, 100));
router.use(logRequest);

// ==================== DOCTOR MANAGEMENT ====================

// Get all doctors in the hospital
router.get('/doctors', async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', specialization = '', status = 'all' } = req.query;
    const offset = (page - 1) * limit;

    // Get hospital admin's hospital
    const adminHospital = await executeQuery(
      'SELECT hospital_id FROM hospital_admins WHERE user_id = ?',
      [req.user.id]
    );

    if (adminHospital.length === 0) {
      return res.status(404).json({
        error: 'Hospital not found',
        message: 'Hospital admin not associated with any hospital'
      });
    }

    const hospitalId = adminHospital[0].hospital_id;

    let whereClause = 'WHERE d.hospital_id = ?';
    let params = [hospitalId];

    if (search) {
      whereClause += ' AND (u.full_name LIKE ? OR d.specialization LIKE ? OR d.license_number LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    if (specialization) {
      whereClause += ' AND d.specialization = ?';
      params.push(specialization);
    }

    if (status !== 'all') {
      const statusCondition = status === 'available' ? 'd.is_available = 1' : 'd.is_available = 0';
      whereClause += ` AND ${statusCondition}`;
    }

    // Get total count
    const countResult = await executeQuery(
      `SELECT COUNT(*) as total FROM doctors d 
       JOIN users u ON d.user_id = u.id 
       ${whereClause}`,
      params
    );
    const total = countResult[0].total;

    // Get doctors with pagination
    const doctors = await executeQuery(
      `SELECT d.*, u.full_name, u.email, u.phone_number, u.is_active, u.is_verified 
       FROM doctors d 
       JOIN users u ON d.user_id = u.id 
       ${whereClause} 
       ORDER BY u.full_name ASC LIMIT ? OFFSET ?`,
      [...params, parseInt(limit), offset]
    );

    res.json({
      doctors,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get doctors error:', error);
    res.status(500).json({
      error: 'Failed to fetch doctors',
      message: 'An error occurred while fetching doctors'
    });
  }
});

// Add new doctor
router.post('/doctors', async (req, res) => {
  try {
    const {
      email,
      phone_number,
      password,
      full_name,
      specialization,
      license_number,
      experience_years,
      education,
      consultation_fee,
      date_of_birth,
      gender
    } = req.body;

    if (!email || !phone_number || !password || !full_name || !specialization || !license_number) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'Please provide all required information'
      });
    }

    // Get hospital admin's hospital
    const adminHospital = await executeQuery(
      'SELECT hospital_id FROM hospital_admins WHERE user_id = ?',
      [req.user.id]
    );

    if (adminHospital.length === 0) {
      return res.status(404).json({
        error: 'Hospital not found',
        message: 'Hospital admin not associated with any hospital'
      });
    }

    const hospitalId = adminHospital[0].hospital_id;

    // Check if user already exists
    const existingUser = await executeQuery(
      'SELECT id FROM users WHERE email = ? OR phone_number = ?',
      [email, phone_number]
    );

    if (existingUser.length > 0) {
      return res.status(409).json({
        error: 'User already exists',
        message: 'A user with this email or phone number already exists'
      });
    }

    // Check if license number already exists
    const existingLicense = await executeQuery(
      'SELECT id FROM doctors WHERE license_number = ?',
      [license_number]
    );

    if (existingLicense.length > 0) {
      return res.status(409).json({
        error: 'License already exists',
        message: 'A doctor with this license number already exists'
      });
    }

    // Hash password
    const bcrypt = await import('bcryptjs');
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Generate user ID
    const userId = `DOCTOR_${uuidv4().replace(/-/g, '').substring(0, 8)}`;

    // Create user and doctor in transaction
    const queries = [
      {
        query: `INSERT INTO users (id, role, email, phone_number, password_hash, full_name, date_of_birth, gender) 
                VALUES (?, 'doctor', ?, ?, ?, ?, ?, ?)`,
        params: [userId, email, phone_number, passwordHash, full_name, date_of_birth, gender]
      },
      {
        query: `INSERT INTO doctors (id, user_id, hospital_id, specialization, license_number, experience_years, education, consultation_fee) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        params: [`DOC_${uuidv4().replace(/-/g, '').substring(0, 8)}`, userId, hospitalId, specialization, license_number, experience_years, education, consultation_fee]
      }
    ];

    await executeTransaction(queries);

    const newDoctor = await executeQuery(
      `SELECT d.*, u.full_name, u.email, u.phone_number 
       FROM doctors d 
       JOIN users u ON d.user_id = u.id 
       WHERE d.user_id = ?`,
      [userId]
    );

    res.status(201).json({
      message: 'Doctor added successfully',
      doctor: newDoctor[0]
    });

  } catch (error) {
    console.error('Add doctor error:', error);
    res.status(500).json({
      error: 'Failed to add doctor',
      message: 'An error occurred while adding doctor'
    });
  }
});

// Update doctor
router.put('/doctors/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      specialization,
      experience_years,
      education,
      consultation_fee,
      is_available
    } = req.body;

    // Get hospital admin's hospital
    const adminHospital = await executeQuery(
      'SELECT hospital_id FROM hospital_admins WHERE user_id = ?',
      [req.user.id]
    );

    if (adminHospital.length === 0) {
      return res.status(404).json({
        error: 'Hospital not found',
        message: 'Hospital admin not associated with any hospital'
      });
    }

    const hospitalId = adminHospital[0].hospital_id;

    // Check if doctor exists and belongs to this hospital
    const doctor = await executeQuery(
      'SELECT id FROM doctors WHERE id = ? AND hospital_id = ?',
      [id, hospitalId]
    );

    if (doctor.length === 0) {
      return res.status(404).json({
        error: 'Doctor not found',
        message: 'Doctor does not exist or does not belong to this hospital'
      });
    }

    const updateFields = [];
    const updateValues = [];

    if (specialization) {
      updateFields.push('specialization = ?');
      updateValues.push(specialization);
    }
    if (experience_years) {
      updateFields.push('experience_years = ?');
      updateValues.push(experience_years);
    }
    if (education) {
      updateFields.push('education = ?');
      updateValues.push(education);
    }
    if (consultation_fee) {
      updateFields.push('consultation_fee = ?');
      updateValues.push(consultation_fee);
    }
    if (typeof is_available === 'boolean') {
      updateFields.push('is_available = ?');
      updateValues.push(is_available);
    }

    if (updateFields.length === 0) {
      return res.status(400).json({
        error: 'No fields to update',
        message: 'Please provide at least one field to update'
      });
    }

    updateValues.push(id);

    await executeQuery(
      `UPDATE doctors SET ${updateFields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      updateValues
    );

    const updatedDoctor = await executeQuery(
      `SELECT d.*, u.full_name, u.email, u.phone_number 
       FROM doctors d 
       JOIN users u ON d.user_id = u.id 
       WHERE d.id = ?`,
      [id]
    );

    res.json({
      message: 'Doctor updated successfully',
      doctor: updatedDoctor[0]
    });

  } catch (error) {
    console.error('Update doctor error:', error);
    res.status(500).json({
      error: 'Failed to update doctor',
      message: 'An error occurred while updating doctor'
    });
  }
});

// Remove doctor from hospital
router.delete('/doctors/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Get hospital admin's hospital
    const adminHospital = await executeQuery(
      'SELECT hospital_id FROM hospital_admins WHERE user_id = ?',
      [req.user.id]
    );

    if (adminHospital.length === 0) {
      return res.status(404).json({
        error: 'Hospital not found',
        message: 'Hospital admin not associated with any hospital'
      });
    }

    const hospitalId = adminHospital[0].hospital_id;

    // Check if doctor exists and belongs to this hospital
    const doctor = await executeQuery(
      'SELECT id FROM doctors WHERE id = ? AND hospital_id = ?',
      [id, hospitalId]
    );

    if (doctor.length === 0) {
      return res.status(404).json({
        error: 'Doctor not found',
        message: 'Doctor does not exist or does not belong to this hospital'
      });
    }

    // Check if doctor has upcoming appointments
    const upcomingAppointments = await executeQuery(
      'SELECT COUNT(*) as count FROM appointments WHERE doctor_id = ? AND appointment_date >= CURDATE() AND status IN ("scheduled", "confirmed")',
      [id]
    );

    if (upcomingAppointments[0].count > 0) {
      return res.status(400).json({
        error: 'Cannot remove doctor',
        message: 'Doctor has upcoming appointments. Please reschedule or cancel them first.'
      });
    }

    // Remove doctor from hospital (set hospital_id to NULL)
    await executeQuery(
      'UPDATE doctors SET hospital_id = NULL, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [id]
    );

    res.json({
      message: 'Doctor removed from hospital successfully'
    });

  } catch (error) {
    console.error('Remove doctor error:', error);
    res.status(500).json({
      error: 'Failed to remove doctor',
      message: 'An error occurred while removing doctor'
    });
  }
});

// ==================== PATIENT MANAGEMENT ====================

// Get all patients
router.get('/patients', async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', blood_type = '' } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = '';
    let params = [];

    if (search) {
      whereClause += 'WHERE (u.full_name LIKE ? OR u.phone_number LIKE ? OR p.emergency_contact_phone LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    if (blood_type) {
      const bloodCondition = 'p.blood_type = ?';
      whereClause += whereClause ? ' AND ' + bloodCondition : 'WHERE ' + bloodCondition;
      params.push(blood_type);
    }

    // Get total count
    const countResult = await executeQuery(
      `SELECT COUNT(*) as total FROM patients p 
       JOIN users u ON p.user_id = u.id 
       ${whereClause}`,
      params
    );
    const total = countResult[0].total;

    // Get patients with pagination
    const patients = await executeQuery(
      `SELECT p.*, u.full_name, u.email, u.phone_number, u.is_active, u.is_verified 
       FROM patients p 
       JOIN users u ON p.user_id = u.id 
       ${whereClause} 
       ORDER BY u.full_name ASC LIMIT ? OFFSET ?`,
      [...params, parseInt(limit), offset]
    );

    res.json({
      patients,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get patients error:', error);
    res.status(500).json({
      error: 'Failed to fetch patients',
      message: 'An error occurred while fetching patients'
    });
  }
});

// Get patient details
router.get('/patients/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const patient = await executeQuery(
      `SELECT p.*, u.full_name, u.email, u.phone_number, u.date_of_birth, u.gender, u.is_active, u.is_verified 
       FROM patients p 
       JOIN users u ON p.user_id = u.id 
       WHERE p.id = ?`,
      [id]
    );

    if (patient.length === 0) {
      return res.status(404).json({
        error: 'Patient not found',
        message: 'Patient does not exist'
      });
    }

    // Get patient's appointments
    const appointments = await executeQuery(
      `SELECT a.*, d.specialization, u.full_name as doctor_name 
       FROM appointments a 
       JOIN doctors d ON a.doctor_id = d.id 
       JOIN users u ON d.user_id = u.id 
       WHERE a.patient_id = ? 
       ORDER BY a.appointment_date DESC, a.appointment_time DESC`,
      [id]
    );

    // Get patient's consultations
    const consultations = await executeQuery(
      `SELECT c.*, d.specialization, u.full_name as doctor_name 
       FROM consultations c 
       JOIN doctors d ON c.doctor_id = d.id 
       JOIN users u ON d.user_id = u.id 
       WHERE c.patient_id = ? 
       ORDER BY c.consultation_date DESC`,
      [id]
    );

    // Get patient's medical records
    const medicalRecords = await executeQuery(
      `SELECT mr.*, u.full_name as uploaded_by_name 
       FROM medical_records mr 
       LEFT JOIN users u ON mr.uploaded_by = u.id 
       WHERE mr.patient_id = ? 
       ORDER BY mr.record_date DESC`,
      [id]
    );

    res.json({
      patient: patient[0],
      appointments,
      consultations,
      medicalRecords
    });

  } catch (error) {
    console.error('Get patient error:', error);
    res.status(500).json({
      error: 'Failed to fetch patient',
      message: 'An error occurred while fetching patient'
    });
  }
});

// ==================== APPOINTMENT MANAGEMENT ====================

// Get all appointments
router.get('/appointments', async (req, res) => {
  try {
    const { page = 1, limit = 10, status = '', date = '', doctor_id = '' } = req.query;
    const offset = (page - 1) * limit;

    // Get hospital admin's hospital
    const adminHospital = await executeQuery(
      'SELECT hospital_id FROM hospital_admins WHERE user_id = ?',
      [req.user.id]
    );

    if (adminHospital.length === 0) {
      return res.status(404).json({
        error: 'Hospital not found',
        message: 'Hospital admin not associated with any hospital'
      });
    }

    const hospitalId = adminHospital[0].hospital_id;

    let whereClause = 'WHERE a.hospital_id = ?';
    let params = [hospitalId];

    if (status) {
      whereClause += ' AND a.status = ?';
      params.push(status);
    }

    if (date) {
      whereClause += ' AND DATE(a.appointment_date) = ?';
      params.push(date);
    }

    if (doctor_id) {
      whereClause += ' AND a.doctor_id = ?';
      params.push(doctor_id);
    }

    // Get total count
    const countResult = await executeQuery(
      `SELECT COUNT(*) as total FROM appointments a 
       JOIN doctors d ON a.doctor_id = d.id 
       JOIN users du ON d.user_id = du.id 
       JOIN patients p ON a.patient_id = p.id 
       JOIN users pu ON p.user_id = pu.id 
       ${whereClause}`,
      params
    );
    const total = countResult[0].total;

    // Get appointments with pagination
    const appointments = await executeQuery(
      `SELECT a.*, 
              d.specialization, du.full_name as doctor_name, du.phone_number as doctor_phone,
              pu.full_name as patient_name, pu.phone_number as patient_phone,
              p.blood_type
       FROM appointments a 
       JOIN doctors d ON a.doctor_id = d.id 
       JOIN users du ON d.user_id = du.id 
       JOIN patients p ON a.patient_id = p.id 
       JOIN users pu ON p.user_id = pu.id 
       ${whereClause} 
       ORDER BY a.appointment_date ASC, a.appointment_time ASC 
       LIMIT ? OFFSET ?`,
      [...params, parseInt(limit), offset]
    );

    res.json({
      appointments,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get appointments error:', error);
    res.status(500).json({
      error: 'Failed to fetch appointments',
      message: 'An error occurred while fetching appointments'
    });
  }
});

// Update appointment status
router.patch('/appointments/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !['scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show'].includes(status)) {
      return res.status(400).json({
        error: 'Invalid status',
        message: 'Please provide a valid appointment status'
      });
    }

    // Get hospital admin's hospital
    const adminHospital = await executeQuery(
      'SELECT hospital_id FROM hospital_admins WHERE user_id = ?',
      [req.user.id]
    );

    if (adminHospital.length === 0) {
      return res.status(404).json({
        error: 'Hospital not found',
        message: 'Hospital admin not associated with any hospital'
      });
    }

    const hospitalId = adminHospital[0].hospital_id;

    // Check if appointment exists and belongs to this hospital
    const appointment = await executeQuery(
      'SELECT id FROM appointments WHERE id = ? AND hospital_id = ?',
      [id, hospitalId]
    );

    if (appointment.length === 0) {
      return res.status(404).json({
        error: 'Appointment not found',
        message: 'Appointment does not exist or does not belong to this hospital'
      });
    }

    await executeQuery(
      'UPDATE appointments SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [status, id]
    );

    res.json({
      message: 'Appointment status updated successfully'
    });

  } catch (error) {
    console.error('Update appointment status error:', error);
    res.status(500).json({
      error: 'Failed to update appointment status',
      message: 'An error occurred while updating appointment status'
    });
  }
});

// ==================== HOSPITAL STATISTICS ====================

// Get hospital statistics
router.get('/statistics', async (req, res) => {
  try {
    // Get hospital admin's hospital
    const adminHospital = await executeQuery(
      'SELECT hospital_id FROM hospital_admins WHERE user_id = ?',
      [req.user.id]
    );

    if (adminHospital.length === 0) {
      return res.status(404).json({
        error: 'Hospital not found',
        message: 'Hospital admin not associated with any hospital'
      });
    }

    const hospitalId = adminHospital[0].hospital_id;

    const [
      totalDoctors,
      totalPatients,
      totalAppointments,
      totalConsultations,
      appointmentsByStatus,
      appointmentsByMonth,
      recentAppointments
    ] = await Promise.all([
      executeQuery('SELECT COUNT(*) as count FROM doctors WHERE hospital_id = ?', [hospitalId]),
      executeQuery('SELECT COUNT(*) as count FROM patients'),
      executeQuery('SELECT COUNT(*) as count FROM appointments WHERE hospital_id = ?', [hospitalId]),
      executeQuery('SELECT COUNT(*) as count FROM consultations c JOIN appointments a ON c.appointment_id = a.id WHERE a.hospital_id = ?', [hospitalId]),
      executeQuery('SELECT status, COUNT(*) as count FROM appointments WHERE hospital_id = ? GROUP BY status', [hospitalId]),
      executeQuery(`
        SELECT DATE_FORMAT(appointment_date, '%Y-%m') as month, COUNT(*) as count 
        FROM appointments 
        WHERE hospital_id = ? AND appointment_date >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
        GROUP BY month 
        ORDER BY month
      `, [hospitalId]),
      executeQuery(`
        SELECT a.*, du.full_name as doctor_name, pu.full_name as patient_name
        FROM appointments a 
        JOIN doctors d ON a.doctor_id = d.id 
        JOIN users du ON d.user_id = du.id 
        JOIN patients p ON a.patient_id = p.id 
        JOIN users pu ON p.user_id = pu.id 
        WHERE a.hospital_id = ? 
        ORDER BY a.created_at DESC 
        LIMIT 10
      `, [hospitalId])
    ]);

    res.json({
      statistics: {
        totalDoctors: totalDoctors[0].count,
        totalPatients: totalPatients[0].count,
        totalAppointments: totalAppointments[0].count,
        totalConsultations: totalConsultations[0].count,
        appointmentsByStatus: appointmentsByStatus.reduce((acc, item) => {
          acc[item.status] = item.count;
          return acc;
        }, {}),
        appointmentsByMonth,
        recentAppointments
      }
    });

  } catch (error) {
    console.error('Get statistics error:', error);
    res.status(500).json({
      error: 'Failed to fetch statistics',
      message: 'An error occurred while fetching statistics'
    });
  }
});

export default router; 