import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { executeQuery, executeTransaction } from '../database/connection.js';
import { authenticateToken, requirePatient, rateLimiter } from '../middleware/auth.js';
import { logRequest } from '../middleware/auth.js';

const router = express.Router();

// Apply middleware
router.use(authenticateToken);
router.use(requirePatient);
router.use(rateLimiter(15 * 60 * 1000, 100));
router.use(logRequest);

// ==================== PATIENT PROFILE ====================

// Get patient profile
router.get('/profile', async (req, res) => {
  try {
    const patient = await executeQuery(
      `SELECT p.*, u.full_name, u.email, u.phone_number, u.date_of_birth, u.gender, u.is_active, u.is_verified 
       FROM patients p 
       JOIN users u ON p.user_id = u.id 
       WHERE p.user_id = ?`,
      [req.user.id]
    );

    if (patient.length === 0) {
      return res.status(404).json({
        error: 'Patient profile not found',
        message: 'Patient profile does not exist'
      });
    }

    res.json({
      patient: patient[0]
    });

  } catch (error) {
    console.error('Get patient profile error:', error);
    res.status(500).json({
      error: 'Failed to fetch patient profile',
      message: 'An error occurred while fetching patient profile'
    });
  }
});

// Update patient profile
router.put('/profile', async (req, res) => {
  try {
    const {
      blood_type,
      emergency_contact_name,
      emergency_contact_phone,
      emergency_contact_relationship,
      insurance_provider,
      insurance_number,
      medical_history,
      allergies
    } = req.body;

    // Get patient ID
    const patient = await executeQuery(
      'SELECT id FROM patients WHERE user_id = ?',
      [req.user.id]
    );

    if (patient.length === 0) {
      return res.status(404).json({
        error: 'Patient not found',
        message: 'Patient profile does not exist'
      });
    }

    const patientId = patient[0].id;

    const updateFields = [];
    const updateValues = [];

    if (blood_type) {
      updateFields.push('blood_type = ?');
      updateValues.push(blood_type);
    }
    if (emergency_contact_name) {
      updateFields.push('emergency_contact_name = ?');
      updateValues.push(emergency_contact_name);
    }
    if (emergency_contact_phone) {
      updateFields.push('emergency_contact_phone = ?');
      updateValues.push(emergency_contact_phone);
    }
    if (emergency_contact_relationship) {
      updateFields.push('emergency_contact_relationship = ?');
      updateValues.push(emergency_contact_relationship);
    }
    if (insurance_provider) {
      updateFields.push('insurance_provider = ?');
      updateValues.push(insurance_provider);
    }
    if (insurance_number) {
      updateFields.push('insurance_number = ?');
      updateValues.push(insurance_number);
    }
    if (medical_history) {
      updateFields.push('medical_history = ?');
      updateValues.push(medical_history);
    }
    if (allergies) {
      updateFields.push('allergies = ?');
      updateValues.push(JSON.stringify(allergies));
    }

    if (updateFields.length === 0) {
      return res.status(400).json({
        error: 'No fields to update',
        message: 'Please provide at least one field to update'
      });
    }

    updateValues.push(patientId);

    await executeQuery(
      `UPDATE patients SET ${updateFields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      updateValues
    );

    const updatedPatient = await executeQuery(
      `SELECT p.*, u.full_name, u.email, u.phone_number, u.date_of_birth, u.gender, u.is_active, u.is_verified 
       FROM patients p 
       JOIN users u ON p.user_id = u.id 
       WHERE p.id = ?`,
      [patientId]
    );

    res.json({
      message: 'Patient profile updated successfully',
      patient: updatedPatient[0]
    });

  } catch (error) {
    console.error('Update patient profile error:', error);
    res.status(500).json({
      error: 'Failed to update patient profile',
      message: 'An error occurred while updating patient profile'
    });
  }
});

// ==================== APPOINTMENT MANAGEMENT ====================

// Get patient's appointments
router.get('/appointments', async (req, res) => {
  try {
    const { page = 1, limit = 10, status = '', date = '' } = req.query;
    const offset = (page - 1) * limit;

    // Get patient ID
    const patient = await executeQuery(
      'SELECT id FROM patients WHERE user_id = ?',
      [req.user.id]
    );

    if (patient.length === 0) {
      return res.status(404).json({
        error: 'Patient not found',
        message: 'Patient profile does not exist'
      });
    }

    const patientId = patient[0].id;

    let whereClause = 'WHERE a.patient_id = ?';
    let params = [patientId];

    if (status) {
      whereClause += ' AND a.status = ?';
      params.push(status);
    }

    if (date) {
      whereClause += ' AND DATE(a.appointment_date) = ?';
      params.push(date);
    }

    // Get total count
    const countResult = await executeQuery(
      `SELECT COUNT(*) as total FROM appointments a 
       JOIN doctors d ON a.doctor_id = d.id 
       JOIN users du ON d.user_id = du.id 
       ${whereClause}`,
      params
    );
    const total = countResult[0].total;

    // Get appointments with pagination
    const appointments = await executeQuery(
      `SELECT a.*, 
              d.specialization, du.full_name as doctor_name, du.phone_number as doctor_phone,
              h.name as hospital_name, h.address as hospital_address
       FROM appointments a 
       JOIN doctors d ON a.doctor_id = d.id 
       JOIN users du ON d.user_id = du.id 
       JOIN hospitals h ON a.hospital_id = h.id 
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

// Book new appointment
router.post('/appointments', async (req, res) => {
  try {
    const {
      doctor_id,
      hospital_id,
      appointment_date,
      appointment_time,
      reason,
      type = 'consultation'
    } = req.body;

    if (!doctor_id || !hospital_id || !appointment_date || !appointment_time) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'Please provide doctor ID, hospital ID, appointment date and time'
      });
    }

    // Get patient ID
    const patient = await executeQuery(
      'SELECT id FROM patients WHERE user_id = ?',
      [req.user.id]
    );

    if (patient.length === 0) {
      return res.status(404).json({
        error: 'Patient not found',
        message: 'Patient profile does not exist'
      });
    }

    const patientId = patient[0].id;

    // Check if doctor exists and is available
    const doctor = await executeQuery(
      'SELECT id, is_available FROM doctors WHERE id = ?',
      [doctor_id]
    );

    if (doctor.length === 0) {
      return res.status(404).json({
        error: 'Doctor not found',
        message: 'Doctor does not exist'
      });
    }

    if (!doctor[0].is_available) {
      return res.status(400).json({
        error: 'Doctor not available',
        message: 'Doctor is currently not available for appointments'
      });
    }

    // Check if hospital exists
    const hospital = await executeQuery(
      'SELECT id FROM hospitals WHERE id = ?',
      [hospital_id]
    );

    if (hospital.length === 0) {
      return res.status(404).json({
        error: 'Hospital not found',
        message: 'Hospital does not exist'
      });
    }

    // Check if appointment time is available
    const existingAppointment = await executeQuery(
      `SELECT id FROM appointments 
       WHERE doctor_id = ? AND appointment_date = ? AND appointment_time = ? 
       AND status IN ('scheduled', 'confirmed')`,
      [doctor_id, appointment_date, appointment_time]
    );

    if (existingAppointment.length > 0) {
      return res.status(409).json({
        error: 'Time slot not available',
        message: 'This time slot is already booked'
      });
    }

    // Check if appointment date is in the future
    const appointmentDateTime = new Date(`${appointment_date} ${appointment_time}`);
    const now = new Date();

    if (appointmentDateTime <= now) {
      return res.status(400).json({
        error: 'Invalid appointment date',
        message: 'Appointment date must be in the future'
      });
    }

    const appointmentId = `APT_${uuidv4().replace(/-/g, '').substring(0, 8)}`;

    const appointment = await executeQuery(
      `INSERT INTO appointments (id, patient_id, doctor_id, hospital_id, appointment_date, appointment_time, reason, type) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [appointmentId, patientId, doctor_id, hospital_id, appointment_date, appointment_time, reason, type]
    );

    const newAppointment = await executeQuery(
      `SELECT a.*, 
              d.specialization, du.full_name as doctor_name, du.phone_number as doctor_phone,
              h.name as hospital_name, h.address as hospital_address
       FROM appointments a 
       JOIN doctors d ON a.doctor_id = d.id 
       JOIN users du ON d.user_id = du.id 
       JOIN hospitals h ON a.hospital_id = h.id 
       WHERE a.id = ?`,
      [appointmentId]
    );

    res.status(201).json({
      message: 'Appointment booked successfully',
      appointment: newAppointment[0]
    });

  } catch (error) {
    console.error('Book appointment error:', error);
    res.status(500).json({
      error: 'Failed to book appointment',
      message: 'An error occurred while booking appointment'
    });
  }
});

// Cancel appointment
router.patch('/appointments/:id/cancel', async (req, res) => {
  try {
    const { id } = req.params;

    // Get patient ID
    const patient = await executeQuery(
      'SELECT id FROM patients WHERE user_id = ?',
      [req.user.id]
    );

    if (patient.length === 0) {
      return res.status(404).json({
        error: 'Patient not found',
        message: 'Patient profile does not exist'
      });
    }

    const patientId = patient[0].id;

    // Check if appointment exists and belongs to this patient
    const appointment = await executeQuery(
      'SELECT id, status, appointment_date FROM appointments WHERE id = ? AND patient_id = ?',
      [id, patientId]
    );

    if (appointment.length === 0) {
      return res.status(404).json({
        error: 'Appointment not found',
        message: 'Appointment does not exist or does not belong to this patient'
      });
    }

    if (appointment[0].status === 'cancelled') {
      return res.status(400).json({
        error: 'Appointment already cancelled',
        message: 'This appointment has already been cancelled'
      });
    }

    if (appointment[0].status === 'completed') {
      return res.status(400).json({
        error: 'Cannot cancel completed appointment',
        message: 'Cannot cancel a completed appointment'
      });
    }

    // Check if appointment is within 24 hours
    const appointmentDate = new Date(appointment[0].appointment_date);
    const now = new Date();
    const hoursDifference = (appointmentDate - now) / (1000 * 60 * 60);

    if (hoursDifference < 24) {
      return res.status(400).json({
        error: 'Cannot cancel appointment',
        message: 'Appointments can only be cancelled at least 24 hours in advance'
      });
    }

    await executeQuery(
      'UPDATE appointments SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      ['cancelled', id]
    );

    res.json({
      message: 'Appointment cancelled successfully'
    });

  } catch (error) {
    console.error('Cancel appointment error:', error);
    res.status(500).json({
      error: 'Failed to cancel appointment',
      message: 'An error occurred while cancelling appointment'
    });
  }
});

// ==================== CONSULTATION MANAGEMENT ====================

// Get patient's consultations
router.get('/consultations', async (req, res) => {
  try {
    const { page = 1, limit = 10, date = '' } = req.query;
    const offset = (page - 1) * limit;

    // Get patient ID
    const patient = await executeQuery(
      'SELECT id FROM patients WHERE user_id = ?',
      [req.user.id]
    );

    if (patient.length === 0) {
      return res.status(404).json({
        error: 'Patient not found',
        message: 'Patient profile does not exist'
      });
    }

    const patientId = patient[0].id;

    let whereClause = 'WHERE c.patient_id = ?';
    let params = [patientId];

    if (date) {
      whereClause += ' AND DATE(c.consultation_date) = ?';
      params.push(date);
    }

    // Get total count
    const countResult = await executeQuery(
      `SELECT COUNT(*) as total FROM consultations c 
       JOIN doctors d ON c.doctor_id = d.id 
       JOIN users du ON d.user_id = du.id 
       ${whereClause}`,
      params
    );
    const total = countResult[0].total;

    // Get consultations with pagination
    const consultations = await executeQuery(
      `SELECT c.*, 
              d.specialization, du.full_name as doctor_name, du.phone_number as doctor_phone
       FROM consultations c 
       JOIN doctors d ON c.doctor_id = d.id 
       JOIN users du ON d.user_id = du.id 
       ${whereClause} 
       ORDER BY c.consultation_date DESC 
       LIMIT ? OFFSET ?`,
      [...params, parseInt(limit), offset]
    );

    res.json({
      consultations,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get consultations error:', error);
    res.status(500).json({
      error: 'Failed to fetch consultations',
      message: 'An error occurred while fetching consultations'
    });
  }
});

// ==================== PRESCRIPTION MANAGEMENT ====================

// Get patient's prescriptions
router.get('/prescriptions', async (req, res) => {
  try {
    const { page = 1, limit = 10, status = '' } = req.query;
    const offset = (page - 1) * limit;

    // Get patient ID
    const patient = await executeQuery(
      'SELECT id FROM patients WHERE user_id = ?',
      [req.user.id]
    );

    if (patient.length === 0) {
      return res.status(404).json({
        error: 'Patient not found',
        message: 'Patient profile does not exist'
      });
    }

    const patientId = patient[0].id;

    let whereClause = 'WHERE p.patient_id = ?';
    let params = [patientId];

    if (status) {
      whereClause += ' AND p.status = ?';
      params.push(status);
    }

    // Get total count
    const countResult = await executeQuery(
      `SELECT COUNT(*) as total FROM prescriptions p 
       JOIN doctors d ON p.doctor_id = d.id 
       JOIN users du ON d.user_id = du.id 
       ${whereClause}`,
      params
    );
    const total = countResult[0].total;

    // Get prescriptions with pagination
    const prescriptions = await executeQuery(
      `SELECT p.*, 
              d.specialization, du.full_name as doctor_name, du.phone_number as doctor_phone
       FROM prescriptions p 
       JOIN doctors d ON p.doctor_id = d.id 
       JOIN users du ON d.user_id = du.id 
       ${whereClause} 
       ORDER BY p.prescription_date DESC 
       LIMIT ? OFFSET ?`,
      [...params, parseInt(limit), offset]
    );

    res.json({
      prescriptions,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get prescriptions error:', error);
    res.status(500).json({
      error: 'Failed to fetch prescriptions',
      message: 'An error occurred while fetching prescriptions'
    });
  }
});

// ==================== MEDICAL RECORDS ====================

// Get patient's medical records
router.get('/medical-records', async (req, res) => {
  try {
    const { page = 1, limit = 10, record_type = '' } = req.query;
    const offset = (page - 1) * limit;

    // Get patient ID
    const patient = await executeQuery(
      'SELECT id FROM patients WHERE user_id = ?',
      [req.user.id]
    );

    if (patient.length === 0) {
      return res.status(404).json({
        error: 'Patient not found',
        message: 'Patient profile does not exist'
      });
    }

    const patientId = patient[0].id;

    let whereClause = 'WHERE mr.patient_id = ?';
    let params = [patientId];

    if (record_type) {
      whereClause += ' AND mr.record_type = ?';
      params.push(record_type);
    }

    // Get total count
    const countResult = await executeQuery(
      `SELECT COUNT(*) as total FROM medical_records mr 
       LEFT JOIN users u ON mr.uploaded_by = u.id 
       ${whereClause}`,
      params
    );
    const total = countResult[0].total;

    // Get medical records with pagination
    const medicalRecords = await executeQuery(
      `SELECT mr.*, u.full_name as uploaded_by_name 
       FROM medical_records mr 
       LEFT JOIN users u ON mr.uploaded_by = u.id 
       ${whereClause} 
       ORDER BY mr.record_date DESC 
       LIMIT ? OFFSET ?`,
      [...params, parseInt(limit), offset]
    );

    res.json({
      medicalRecords,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get medical records error:', error);
    res.status(500).json({
      error: 'Failed to fetch medical records',
      message: 'An error occurred while fetching medical records'
    });
  }
});

// Upload medical record
router.post('/medical-records', async (req, res) => {
  try {
    const {
      record_type,
      title,
      description,
      file_url,
      file_type,
      file_size,
      record_date
    } = req.body;

    if (!record_type || !title || !file_url) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'Please provide record type, title, and file URL'
      });
    }

    // Get patient ID
    const patient = await executeQuery(
      'SELECT id FROM patients WHERE user_id = ?',
      [req.user.id]
    );

    if (patient.length === 0) {
      return res.status(404).json({
        error: 'Patient not found',
        message: 'Patient profile does not exist'
      });
    }

    const patientId = patient[0].id;

    const recordId = `REC_${uuidv4().replace(/-/g, '').substring(0, 8)}`;

    const medicalRecord = await executeQuery(
      `INSERT INTO medical_records (id, patient_id, record_type, title, description, file_url, file_type, file_size, record_date, uploaded_by) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [recordId, patientId, record_type, title, description, file_url, file_type, file_size, record_date, req.user.id]
    );

    const newRecord = await executeQuery(
      `SELECT mr.*, u.full_name as uploaded_by_name 
       FROM medical_records mr 
       LEFT JOIN users u ON mr.uploaded_by = u.id 
       WHERE mr.id = ?`,
      [recordId]
    );

    res.status(201).json({
      message: 'Medical record uploaded successfully',
      medicalRecord: newRecord[0]
    });

  } catch (error) {
    console.error('Upload medical record error:', error);
    res.status(500).json({
      error: 'Failed to upload medical record',
      message: 'An error occurred while uploading medical record'
    });
  }
});

// ==================== DOCTOR SEARCH ====================

// Search available doctors
router.get('/doctors', async (req, res) => {
  try {
    const { page = 1, limit = 10, specialization = '', hospital_id = '', search = '' } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = 'WHERE d.is_available = 1';
    let params = [];

    if (specialization) {
      whereClause += ' AND d.specialization = ?';
      params.push(specialization);
    }

    if (hospital_id) {
      whereClause += ' AND d.hospital_id = ?';
      params.push(hospital_id);
    }

    if (search) {
      whereClause += ' AND (u.full_name LIKE ? OR d.specialization LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    // Get total count
    const countResult = await executeQuery(
      `SELECT COUNT(*) as total FROM doctors d 
       JOIN users u ON d.user_id = u.id 
       JOIN hospitals h ON d.hospital_id = h.id 
       ${whereClause}`,
      params
    );
    const total = countResult[0].total;

    // Get doctors with pagination
    const doctors = await executeQuery(
      `SELECT d.*, u.full_name, u.email, u.phone_number, h.name as hospital_name, h.address as hospital_address
       FROM doctors d 
       JOIN users u ON d.user_id = u.id 
       JOIN hospitals h ON d.hospital_id = h.id 
       ${whereClause} 
       ORDER BY u.full_name ASC 
       LIMIT ? OFFSET ?`,
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
    console.error('Search doctors error:', error);
    res.status(500).json({
      error: 'Failed to search doctors',
      message: 'An error occurred while searching doctors'
    });
  }
});

// ==================== HOSPITAL SEARCH ====================

// Search hospitals
router.get('/hospitals', async (req, res) => {
  try {
    const { page = 1, limit = 10, city = '', search = '' } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = 'WHERE h.is_active = 1';
    let params = [];

    if (city) {
      whereClause += ' AND h.city = ?';
      params.push(city);
    }

    if (search) {
      whereClause += ' AND (h.name LIKE ? OR h.city LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    // Get total count
    const countResult = await executeQuery(
      `SELECT COUNT(*) as total FROM hospitals h ${whereClause}`,
      params
    );
    const total = countResult[0].total;

    // Get hospitals with pagination
    const hospitals = await executeQuery(
      `SELECT h.*, COUNT(d.id) as doctor_count 
       FROM hospitals h 
       LEFT JOIN doctors d ON h.id = d.hospital_id AND d.is_available = 1
       ${whereClause} 
       GROUP BY h.id 
       ORDER BY h.name ASC 
       LIMIT ? OFFSET ?`,
      [...params, parseInt(limit), offset]
    );

    res.json({
      hospitals,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Search hospitals error:', error);
    res.status(500).json({
      error: 'Failed to search hospitals',
      message: 'An error occurred while searching hospitals'
    });
  }
});

// ==================== PATIENT STATISTICS ====================

// Get patient statistics
router.get('/statistics', async (req, res) => {
  try {
    // Get patient ID
    const patient = await executeQuery(
      'SELECT id FROM patients WHERE user_id = ?',
      [req.user.id]
    );

    if (patient.length === 0) {
      return res.status(404).json({
        error: 'Patient not found',
        message: 'Patient profile does not exist'
      });
    }

    const patientId = patient[0].id;

    const [
      totalAppointments,
      totalConsultations,
      totalPrescriptions,
      appointmentsByStatus,
      appointmentsByMonth,
      recentAppointments
    ] = await Promise.all([
      executeQuery('SELECT COUNT(*) as count FROM appointments WHERE patient_id = ?', [patientId]),
      executeQuery('SELECT COUNT(*) as count FROM consultations WHERE patient_id = ?', [patientId]),
      executeQuery('SELECT COUNT(*) as count FROM prescriptions WHERE patient_id = ?', [patientId]),
      executeQuery('SELECT status, COUNT(*) as count FROM appointments WHERE patient_id = ? GROUP BY status', [patientId]),
      executeQuery(`
        SELECT DATE_FORMAT(appointment_date, '%Y-%m') as month, COUNT(*) as count 
        FROM appointments 
        WHERE patient_id = ? AND appointment_date >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
        GROUP BY month 
        ORDER BY month
      `, [patientId]),
      executeQuery(`
        SELECT a.*, d.specialization, du.full_name as doctor_name
        FROM appointments a 
        JOIN doctors d ON a.doctor_id = d.id 
        JOIN users du ON d.user_id = du.id 
        WHERE a.patient_id = ? 
        ORDER BY a.created_at DESC 
        LIMIT 10
      `, [patientId])
    ]);

    res.json({
      statistics: {
        totalAppointments: totalAppointments[0].count,
        totalConsultations: totalConsultations[0].count,
        totalPrescriptions: totalPrescriptions[0].count,
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