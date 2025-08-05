import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { executeQuery, executeTransaction } from '../database/connection.js';
import { authenticateToken, requireDoctor, rateLimiter } from '../middleware/auth.js';
import { logRequest } from '../middleware/auth.js';

const router = express.Router();

// Apply middleware
router.use(authenticateToken);
router.use(requireDoctor);
router.use(rateLimiter(15 * 60 * 1000, 100));
router.use(logRequest);

// ==================== DOCTOR PROFILE ====================

// Get doctor profile
router.get('/profile', async (req, res) => {
  try {
    const doctor = await executeQuery(
      `SELECT d.*, u.full_name, u.email, u.phone_number, u.date_of_birth, u.gender, u.is_active, u.is_verified,
              h.name as hospital_name, h.address as hospital_address
       FROM doctors d 
       JOIN users u ON d.user_id = u.id 
       LEFT JOIN hospitals h ON d.hospital_id = h.id 
       WHERE d.user_id = ?`,
      [req.user.id]
    );

    if (doctor.length === 0) {
      return res.status(404).json({
        error: 'Doctor profile not found',
        message: 'Doctor profile does not exist'
      });
    }

    res.json({
      doctor: doctor[0]
    });

  } catch (error) {
    console.error('Get doctor profile error:', error);
    res.status(500).json({
      error: 'Failed to fetch doctor profile',
      message: 'An error occurred while fetching doctor profile'
    });
  }
});

// Update doctor profile
router.put('/profile', async (req, res) => {
  try {
    const {
      specialization,
      experience_years,
      education,
      consultation_fee,
      is_available
    } = req.body;

    // Get doctor ID
    const doctor = await executeQuery(
      'SELECT id FROM doctors WHERE user_id = ?',
      [req.user.id]
    );

    if (doctor.length === 0) {
      return res.status(404).json({
        error: 'Doctor not found',
        message: 'Doctor profile does not exist'
      });
    }

    const doctorId = doctor[0].id;

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

    updateValues.push(doctorId);

    await executeQuery(
      `UPDATE doctors SET ${updateFields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      updateValues
    );

    const updatedDoctor = await executeQuery(
      `SELECT d.*, u.full_name, u.email, u.phone_number, u.date_of_birth, u.gender, u.is_active, u.is_verified,
              h.name as hospital_name, h.address as hospital_address
       FROM doctors d 
       JOIN users u ON d.user_id = u.id 
       LEFT JOIN hospitals h ON d.hospital_id = h.id 
       WHERE d.id = ?`,
      [doctorId]
    );

    res.json({
      message: 'Doctor profile updated successfully',
      doctor: updatedDoctor[0]
    });

  } catch (error) {
    console.error('Update doctor profile error:', error);
    res.status(500).json({
      error: 'Failed to update doctor profile',
      message: 'An error occurred while updating doctor profile'
    });
  }
});

// ==================== APPOINTMENT MANAGEMENT ====================

// Get doctor's appointments
router.get('/appointments', async (req, res) => {
  try {
    const { page = 1, limit = 10, status = '', date = '', patient_id = '' } = req.query;
    const offset = (page - 1) * limit;

    // Get doctor ID
    const doctor = await executeQuery(
      'SELECT id FROM doctors WHERE user_id = ?',
      [req.user.id]
    );

    if (doctor.length === 0) {
      return res.status(404).json({
        error: 'Doctor not found',
        message: 'Doctor profile does not exist'
      });
    }

    const doctorId = doctor[0].id;

    let whereClause = 'WHERE a.doctor_id = ?';
    let params = [doctorId];

    if (status) {
      whereClause += ' AND a.status = ?';
      params.push(status);
    }

    if (date) {
      whereClause += ' AND DATE(a.appointment_date) = ?';
      params.push(date);
    }

    if (patient_id) {
      whereClause += ' AND a.patient_id = ?';
      params.push(patient_id);
    }

    // Get total count
    const countResult = await executeQuery(
      `SELECT COUNT(*) as total FROM appointments a 
       JOIN patients p ON a.patient_id = p.id 
       JOIN users pu ON p.user_id = pu.id 
       ${whereClause}`,
      params
    );
    const total = countResult[0].total;

    // Get appointments with pagination
    const appointments = await executeQuery(
      `SELECT a.*, 
              pu.full_name as patient_name, pu.phone_number as patient_phone,
              p.blood_type, p.emergency_contact_name, p.emergency_contact_phone
       FROM appointments a 
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

    // Get doctor ID
    const doctor = await executeQuery(
      'SELECT id FROM doctors WHERE user_id = ?',
      [req.user.id]
    );

    if (doctor.length === 0) {
      return res.status(404).json({
        error: 'Doctor not found',
        message: 'Doctor profile does not exist'
      });
    }

    const doctorId = doctor[0].id;

    // Check if appointment exists and belongs to this doctor
    const appointment = await executeQuery(
      'SELECT id FROM appointments WHERE id = ? AND doctor_id = ?',
      [id, doctorId]
    );

    if (appointment.length === 0) {
      return res.status(404).json({
        error: 'Appointment not found',
        message: 'Appointment does not exist or does not belong to this doctor'
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

// ==================== CONSULTATION MANAGEMENT ====================

// Get doctor's consultations
router.get('/consultations', async (req, res) => {
  try {
    const { page = 1, limit = 10, patient_id = '', date = '' } = req.query;
    const offset = (page - 1) * limit;

    // Get doctor ID
    const doctor = await executeQuery(
      'SELECT id FROM doctors WHERE user_id = ?',
      [req.user.id]
    );

    if (doctor.length === 0) {
      return res.status(404).json({
        error: 'Doctor not found',
        message: 'Doctor profile does not exist'
      });
    }

    const doctorId = doctor[0].id;

    let whereClause = 'WHERE c.doctor_id = ?';
    let params = [doctorId];

    if (patient_id) {
      whereClause += ' AND c.patient_id = ?';
      params.push(patient_id);
    }

    if (date) {
      whereClause += ' AND DATE(c.consultation_date) = ?';
      params.push(date);
    }

    // Get total count
    const countResult = await executeQuery(
      `SELECT COUNT(*) as total FROM consultations c 
       JOIN patients p ON c.patient_id = p.id 
       JOIN users pu ON p.user_id = pu.id 
       ${whereClause}`,
      params
    );
    const total = countResult[0].total;

    // Get consultations with pagination
    const consultations = await executeQuery(
      `SELECT c.*, 
              pu.full_name as patient_name, pu.phone_number as patient_phone,
              p.blood_type, p.emergency_contact_name, p.emergency_contact_phone
       FROM consultations c 
       JOIN patients p ON c.patient_id = p.id 
       JOIN users pu ON p.user_id = pu.id 
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

// Create new consultation
router.post('/consultations', async (req, res) => {
  try {
    const {
      patient_id,
      appointment_id,
      symptoms,
      diagnosis,
      treatment_plan,
      follow_up_date,
      notes
    } = req.body;

    if (!patient_id) {
      return res.status(400).json({
        error: 'Missing patient ID',
        message: 'Please provide patient ID'
      });
    }

    // Get doctor ID
    const doctor = await executeQuery(
      'SELECT id FROM doctors WHERE user_id = ?',
      [req.user.id]
    );

    if (doctor.length === 0) {
      return res.status(404).json({
        error: 'Doctor not found',
        message: 'Doctor profile does not exist'
      });
    }

    const doctorId = doctor[0].id;

    // Check if patient exists
    const patient = await executeQuery(
      'SELECT id FROM patients WHERE id = ?',
      [patient_id]
    );

    if (patient.length === 0) {
      return res.status(404).json({
        error: 'Patient not found',
        message: 'Patient does not exist'
      });
    }

    // Check if appointment exists (if provided)
    if (appointment_id) {
      const appointment = await executeQuery(
        'SELECT id FROM appointments WHERE id = ? AND doctor_id = ?',
        [appointment_id, doctorId]
      );

      if (appointment.length === 0) {
        return res.status(404).json({
          error: 'Appointment not found',
          message: 'Appointment does not exist or does not belong to this doctor'
        });
      }
    }

    const consultationId = `CONS_${uuidv4().replace(/-/g, '').substring(0, 8)}`;

    const consultation = await executeQuery(
      `INSERT INTO consultations (id, appointment_id, patient_id, doctor_id, symptoms, diagnosis, treatment_plan, follow_up_date, notes) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [consultationId, appointment_id, patient_id, doctorId, symptoms, diagnosis, treatment_plan, follow_up_date, notes]
    );

    const newConsultation = await executeQuery(
      `SELECT c.*, pu.full_name as patient_name 
       FROM consultations c 
       JOIN patients p ON c.patient_id = p.id 
       JOIN users pu ON p.user_id = pu.id 
       WHERE c.id = ?`,
      [consultationId]
    );

    res.status(201).json({
      message: 'Consultation created successfully',
      consultation: newConsultation[0]
    });

  } catch (error) {
    console.error('Create consultation error:', error);
    res.status(500).json({
      error: 'Failed to create consultation',
      message: 'An error occurred while creating consultation'
    });
  }
});

// Update consultation
router.put('/consultations/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      symptoms,
      diagnosis,
      treatment_plan,
      follow_up_date,
      notes
    } = req.body;

    // Get doctor ID
    const doctor = await executeQuery(
      'SELECT id FROM doctors WHERE user_id = ?',
      [req.user.id]
    );

    if (doctor.length === 0) {
      return res.status(404).json({
        error: 'Doctor not found',
        message: 'Doctor profile does not exist'
      });
    }

    const doctorId = doctor[0].id;

    // Check if consultation exists and belongs to this doctor
    const consultation = await executeQuery(
      'SELECT id FROM consultations WHERE id = ? AND doctor_id = ?',
      [id, doctorId]
    );

    if (consultation.length === 0) {
      return res.status(404).json({
        error: 'Consultation not found',
        message: 'Consultation does not exist or does not belong to this doctor'
      });
    }

    const updateFields = [];
    const updateValues = [];

    if (symptoms) {
      updateFields.push('symptoms = ?');
      updateValues.push(symptoms);
    }
    if (diagnosis) {
      updateFields.push('diagnosis = ?');
      updateValues.push(diagnosis);
    }
    if (treatment_plan) {
      updateFields.push('treatment_plan = ?');
      updateValues.push(treatment_plan);
    }
    if (follow_up_date) {
      updateFields.push('follow_up_date = ?');
      updateValues.push(follow_up_date);
    }
    if (notes) {
      updateFields.push('notes = ?');
      updateValues.push(notes);
    }

    if (updateFields.length === 0) {
      return res.status(400).json({
        error: 'No fields to update',
        message: 'Please provide at least one field to update'
      });
    }

    updateValues.push(id);

    await executeQuery(
      `UPDATE consultations SET ${updateFields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      updateValues
    );

    const updatedConsultation = await executeQuery(
      `SELECT c.*, pu.full_name as patient_name 
       FROM consultations c 
       JOIN patients p ON c.patient_id = p.id 
       JOIN users pu ON p.user_id = pu.id 
       WHERE c.id = ?`,
      [id]
    );

    res.json({
      message: 'Consultation updated successfully',
      consultation: updatedConsultation[0]
    });

  } catch (error) {
    console.error('Update consultation error:', error);
    res.status(500).json({
      error: 'Failed to update consultation',
      message: 'An error occurred while updating consultation'
    });
  }
});

// ==================== PRESCRIPTION MANAGEMENT ====================

// Get doctor's prescriptions
router.get('/prescriptions', async (req, res) => {
  try {
    const { page = 1, limit = 10, patient_id = '', status = '' } = req.query;
    const offset = (page - 1) * limit;

    // Get doctor ID
    const doctor = await executeQuery(
      'SELECT id FROM doctors WHERE user_id = ?',
      [req.user.id]
    );

    if (doctor.length === 0) {
      return res.status(404).json({
        error: 'Doctor not found',
        message: 'Doctor profile does not exist'
      });
    }

    const doctorId = doctor[0].id;

    let whereClause = 'WHERE p.doctor_id = ?';
    let params = [doctorId];

    if (patient_id) {
      whereClause += ' AND p.patient_id = ?';
      params.push(patient_id);
    }

    if (status) {
      whereClause += ' AND p.status = ?';
      params.push(status);
    }

    // Get total count
    const countResult = await executeQuery(
      `SELECT COUNT(*) as total FROM prescriptions p 
       JOIN patients pt ON p.patient_id = pt.id 
       JOIN users pu ON pt.user_id = pu.id 
       ${whereClause}`,
      params
    );
    const total = countResult[0].total;

    // Get prescriptions with pagination
    const prescriptions = await executeQuery(
      `SELECT p.*, pu.full_name as patient_name, pu.phone_number as patient_phone
       FROM prescriptions p 
       JOIN patients pt ON p.patient_id = pt.id 
       JOIN users pu ON pt.user_id = pu.id 
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

// Create new prescription
router.post('/prescriptions', async (req, res) => {
  try {
    const {
      patient_id,
      consultation_id,
      medications,
      instructions,
      duration_days
    } = req.body;

    if (!patient_id || !medications) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'Please provide patient ID and medications'
      });
    }

    // Get doctor ID
    const doctor = await executeQuery(
      'SELECT id FROM doctors WHERE user_id = ?',
      [req.user.id]
    );

    if (doctor.length === 0) {
      return res.status(404).json({
        error: 'Doctor not found',
        message: 'Doctor profile does not exist'
      });
    }

    const doctorId = doctor[0].id;

    // Check if patient exists
    const patient = await executeQuery(
      'SELECT id FROM patients WHERE id = ?',
      [patient_id]
    );

    if (patient.length === 0) {
      return res.status(404).json({
        error: 'Patient not found',
        message: 'Patient does not exist'
      });
    }

    // Check if consultation exists (if provided)
    if (consultation_id) {
      const consultation = await executeQuery(
        'SELECT id FROM consultations WHERE id = ? AND doctor_id = ?',
        [consultation_id, doctorId]
      );

      if (consultation.length === 0) {
        return res.status(404).json({
          error: 'Consultation not found',
          message: 'Consultation does not exist or does not belong to this doctor'
        });
      }
    }

    const prescriptionId = `PRESC_${uuidv4().replace(/-/g, '').substring(0, 8)}`;

    const prescription = await executeQuery(
      `INSERT INTO prescriptions (id, consultation_id, patient_id, doctor_id, medications, instructions, duration_days) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [prescriptionId, consultation_id, patient_id, doctorId, JSON.stringify(medications), instructions, duration_days]
    );

    const newPrescription = await executeQuery(
      `SELECT p.*, pu.full_name as patient_name 
       FROM prescriptions p 
       JOIN patients pt ON p.patient_id = pt.id 
       JOIN users pu ON pt.user_id = pu.id 
       WHERE p.id = ?`,
      [prescriptionId]
    );

    res.status(201).json({
      message: 'Prescription created successfully',
      prescription: newPrescription[0]
    });

  } catch (error) {
    console.error('Create prescription error:', error);
    res.status(500).json({
      error: 'Failed to create prescription',
      message: 'An error occurred while creating prescription'
    });
  }
});

// Update prescription status
router.patch('/prescriptions/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !['active', 'completed', 'discontinued'].includes(status)) {
      return res.status(400).json({
        error: 'Invalid status',
        message: 'Please provide a valid prescription status'
      });
    }

    // Get doctor ID
    const doctor = await executeQuery(
      'SELECT id FROM doctors WHERE user_id = ?',
      [req.user.id]
    );

    if (doctor.length === 0) {
      return res.status(404).json({
        error: 'Doctor not found',
        message: 'Doctor profile does not exist'
      });
    }

    const doctorId = doctor[0].id;

    // Check if prescription exists and belongs to this doctor
    const prescription = await executeQuery(
      'SELECT id FROM prescriptions WHERE id = ? AND doctor_id = ?',
      [id, doctorId]
    );

    if (prescription.length === 0) {
      return res.status(404).json({
        error: 'Prescription not found',
        message: 'Prescription does not exist or does not belong to this doctor'
      });
    }

    await executeQuery(
      'UPDATE prescriptions SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [status, id]
    );

    res.json({
      message: 'Prescription status updated successfully'
    });

  } catch (error) {
    console.error('Update prescription status error:', error);
    res.status(500).json({
      error: 'Failed to update prescription status',
      message: 'An error occurred while updating prescription status'
    });
  }
});

// ==================== PATIENT MANAGEMENT ====================

// Get doctor's patients
router.get('/patients', async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    const offset = (page - 1) * limit;

    // Get doctor ID
    const doctor = await executeQuery(
      'SELECT id FROM doctors WHERE user_id = ?',
      [req.user.id]
    );

    if (doctor.length === 0) {
      return res.status(404).json({
        error: 'Doctor not found',
        message: 'Doctor profile does not exist'
      });
    }

    const doctorId = doctor[0].id;

    let whereClause = '';
    let params = [];

    if (search) {
      whereClause = 'WHERE (u.full_name LIKE ? OR u.phone_number LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    // Get patients who have appointments with this doctor
    const patients = await executeQuery(
      `SELECT DISTINCT p.*, u.full_name, u.email, u.phone_number, u.date_of_birth, u.gender,
              COUNT(a.id) as appointment_count,
              COUNT(c.id) as consultation_count
       FROM patients p 
       JOIN users u ON p.user_id = u.id 
       LEFT JOIN appointments a ON p.id = a.patient_id AND a.doctor_id = ?
       LEFT JOIN consultations c ON p.id = c.patient_id AND c.doctor_id = ?
       ${whereClause}
       GROUP BY p.id 
       ORDER BY u.full_name ASC 
       LIMIT ? OFFSET ?`,
      [...params, doctorId, doctorId, parseInt(limit), offset]
    );

    // Get total count
    const countResult = await executeQuery(
      `SELECT COUNT(DISTINCT p.id) as total 
       FROM patients p 
       JOIN users u ON p.user_id = u.id 
       LEFT JOIN appointments a ON p.id = a.patient_id AND a.doctor_id = ?
       LEFT JOIN consultations c ON p.id = c.patient_id AND c.doctor_id = ?
       ${whereClause}`,
      [...params, doctorId, doctorId]
    );
    const total = countResult[0].total;

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

    // Get doctor ID
    const doctor = await executeQuery(
      'SELECT id FROM doctors WHERE user_id = ?',
      [req.user.id]
    );

    if (doctor.length === 0) {
      return res.status(404).json({
        error: 'Doctor not found',
        message: 'Doctor profile does not exist'
      });
    }

    const doctorId = doctor[0].id;

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

    // Get patient's appointments with this doctor
    const appointments = await executeQuery(
      `SELECT a.* 
       FROM appointments a 
       WHERE a.patient_id = ? AND a.doctor_id = ? 
       ORDER BY a.appointment_date DESC, a.appointment_time DESC`,
      [id, doctorId]
    );

    // Get patient's consultations with this doctor
    const consultations = await executeQuery(
      `SELECT c.* 
       FROM consultations c 
       WHERE c.patient_id = ? AND c.doctor_id = ? 
       ORDER BY c.consultation_date DESC`,
      [id, doctorId]
    );

    // Get patient's prescriptions from this doctor
    const prescriptions = await executeQuery(
      `SELECT p.* 
       FROM prescriptions p 
       WHERE p.patient_id = ? AND p.doctor_id = ? 
       ORDER BY p.prescription_date DESC`,
      [id, doctorId]
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
      prescriptions,
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

// ==================== DOCTOR STATISTICS ====================

// Get doctor statistics
router.get('/statistics', async (req, res) => {
  try {
    // Get doctor ID
    const doctor = await executeQuery(
      'SELECT id FROM doctors WHERE user_id = ?',
      [req.user.id]
    );

    if (doctor.length === 0) {
      return res.status(404).json({
        error: 'Doctor not found',
        message: 'Doctor profile does not exist'
      });
    }

    const doctorId = doctor[0].id;

    const [
      totalAppointments,
      totalConsultations,
      totalPrescriptions,
      appointmentsByStatus,
      consultationsByMonth,
      recentAppointments
    ] = await Promise.all([
      executeQuery('SELECT COUNT(*) as count FROM appointments WHERE doctor_id = ?', [doctorId]),
      executeQuery('SELECT COUNT(*) as count FROM consultations WHERE doctor_id = ?', [doctorId]),
      executeQuery('SELECT COUNT(*) as count FROM prescriptions WHERE doctor_id = ?', [doctorId]),
      executeQuery('SELECT status, COUNT(*) as count FROM appointments WHERE doctor_id = ? GROUP BY status', [doctorId]),
      executeQuery(`
        SELECT DATE_FORMAT(consultation_date, '%Y-%m') as month, COUNT(*) as count 
        FROM consultations 
        WHERE doctor_id = ? AND consultation_date >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
        GROUP BY month 
        ORDER BY month
      `, [doctorId]),
      executeQuery(`
        SELECT a.*, pu.full_name as patient_name
        FROM appointments a 
        JOIN patients p ON a.patient_id = p.id 
        JOIN users pu ON p.user_id = pu.id 
        WHERE a.doctor_id = ? 
        ORDER BY a.created_at DESC 
        LIMIT 10
      `, [doctorId])
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
        consultationsByMonth,
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