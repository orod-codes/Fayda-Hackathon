import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { executeQuery, executeTransaction } from '../database/connection.js';
import { authenticateToken, requireSuperAdmin, rateLimiter } from '../middleware/auth.js';
import { logRequest } from '../middleware/auth.js';

const router = express.Router();

// Apply middleware
router.use(authenticateToken);
router.use(requireSuperAdmin);
router.use(rateLimiter(15 * 60 * 1000, 100));
router.use(logRequest);

// ==================== HOSPITAL MANAGEMENT ====================

// Get all hospitals
router.get('/hospitals', async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', status = 'all' } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = '';
    let params = [];

    if (search) {
      whereClause += 'WHERE (h.name LIKE ? OR h.city LIKE ? OR h.email LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    if (status !== 'all') {
      const statusCondition = status === 'active' ? 'h.is_active = 1' : 'h.is_active = 0';
      whereClause += whereClause ? ' AND ' + statusCondition : 'WHERE ' + statusCondition;
    }

    // Get total count
    const countResult = await executeQuery(
      `SELECT COUNT(*) as total FROM hospitals h ${whereClause}`,
      params
    );
    const total = countResult[0].total;

    // Get hospitals with pagination and admin count
    const hospitals = await executeQuery(
      `SELECT h.*, COUNT(ha.id) as admin_count, COUNT(d.id) as doctor_count 
       FROM hospitals h 
       LEFT JOIN hospital_admins ha ON h.id = ha.hospital_id 
       LEFT JOIN doctors d ON h.id = d.hospital_id 
       ${whereClause} 
       GROUP BY h.id 
       ORDER BY h.created_at DESC LIMIT ? OFFSET ?`,
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
    console.error('Get hospitals error:', error);
    res.status(500).json({
      error: 'Failed to fetch hospitals',
      message: 'An error occurred while fetching hospitals'
    });
  }
});

// Get hospital details with admins
router.get('/hospitals/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Get hospital details
    const hospital = await executeQuery(
      'SELECT * FROM hospitals WHERE id = ?',
      [id]
    );

    if (hospital.length === 0) {
      return res.status(404).json({
        error: 'Hospital not found',
        message: 'Hospital does not exist'
      });
    }

    // Get hospital admins
    const admins = await executeQuery(
      `SELECT ha.*, u.full_name, u.email, u.phone_number, u.is_active, u.is_verified 
       FROM hospital_admins ha 
       JOIN users u ON ha.user_id = u.id 
       WHERE ha.hospital_id = ?`,
      [id]
    );

    // Get doctors count
    const doctorsCount = await executeQuery(
      'SELECT COUNT(*) as count FROM doctors WHERE hospital_id = ?',
      [id]
    );

    res.json({
      hospital: hospital[0],
      admins,
      doctorsCount: doctorsCount[0].count
    });

  } catch (error) {
    console.error('Get hospital details error:', error);
    res.status(500).json({
      error: 'Failed to fetch hospital details',
      message: 'An error occurred while fetching hospital details'
    });
  }
});

// Create new hospital
router.post('/hospitals', async (req, res) => {
  try {
    const {
      name,
      address,
      city,
      state,
      country = 'Ethiopia',
      phone,
      email,
      website,
      license_number,
      capacity
    } = req.body;

    if (!name || !address || !city || !phone) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'Please provide hospital name, address, city, and phone'
      });
    }

    // Check if hospital already exists
    const existingHospital = await executeQuery(
      'SELECT id FROM hospitals WHERE name = ? OR license_number = ?',
      [name, license_number]
    );

    if (existingHospital.length > 0) {
      return res.status(409).json({
        error: 'Hospital already exists',
        message: 'A hospital with this name or license number already exists'
      });
    }

    const hospitalId = `HOSP_${uuidv4().replace(/-/g, '').substring(0, 8)}`;

    // Create hospital
    const hospital = await executeQuery(
      `INSERT INTO hospitals (id, name, address, city, state, country, phone, email, website, license_number, capacity) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [hospitalId, name, address, city, state, country, phone, email, website, license_number, capacity]
    );

    // Create default hospital admin if requested
    const { create_default_admin = false, admin_email, admin_phone, admin_password, admin_name } = req.body;
    
    if (create_default_admin && admin_email && admin_phone && admin_password && admin_name) {
      try {
        // Hash password
        const bcrypt = await import('bcryptjs');
        const saltRounds = 12;
        const passwordHash = await bcrypt.hash(admin_password, saltRounds);

        // Generate user ID
        const userId = `HOSP_ADMIN_${uuidv4().replace(/-/g, '').substring(0, 8)}`;

        // Create user and hospital admin in transaction
        const queries = [
          {
            query: `INSERT INTO users (id, role, email, phone_number, password_hash, full_name) 
                    VALUES (?, 'hospital_admin', ?, ?, ?, ?)`,
            params: [userId, admin_email, admin_phone, passwordHash, admin_name]
          },
          {
            query: `INSERT INTO hospital_admins (id, user_id, hospital_id, position, permissions) 
                    VALUES (?, ?, ?, ?, ?)`,
            params: [`HA_${uuidv4().replace(/-/g, '').substring(0, 8)}`, userId, hospitalId, 'Hospital Administrator', JSON.stringify(['manage_doctors', 'view_reports', 'manage_patients'])]
          }
        ];

        await executeTransaction(queries);
      } catch (error) {
        console.error('Failed to create default hospital admin:', error);
        // Continue with hospital creation even if admin creation fails
      }
    }

    const newHospital = await executeQuery(
      'SELECT * FROM hospitals WHERE id = ?',
      [hospitalId]
    );

    res.status(201).json({
      message: 'Hospital created successfully',
      hospital: newHospital[0],
      defaultAdminCreated: create_default_admin
    });

  } catch (error) {
    console.error('Create hospital error:', error);
    res.status(500).json({
      error: 'Failed to create hospital',
      message: 'An error occurred while creating hospital'
    });
  }
});

// Update hospital
router.put('/hospitals/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      address,
      city,
      state,
      country,
      phone,
      email,
      website,
      license_number,
      capacity,
      is_active
    } = req.body;

    // Check if hospital exists
    const existingHospital = await executeQuery(
      'SELECT id FROM hospitals WHERE id = ?',
      [id]
    );

    if (existingHospital.length === 0) {
      return res.status(404).json({
        error: 'Hospital not found',
        message: 'Hospital does not exist'
      });
    }

    // Check for duplicate name/license if updating
    if (name || license_number) {
      const duplicateCheck = await executeQuery(
        'SELECT id FROM hospitals WHERE (name = ? OR license_number = ?) AND id != ?',
        [name, license_number, id]
      );

      if (duplicateCheck.length > 0) {
        return res.status(409).json({
          error: 'Duplicate hospital',
          message: 'A hospital with this name or license number already exists'
        });
      }
    }

    const updateFields = [];
    const updateValues = [];

    if (name) {
      updateFields.push('name = ?');
      updateValues.push(name);
    }
    if (address) {
      updateFields.push('address = ?');
      updateValues.push(address);
    }
    if (city) {
      updateFields.push('city = ?');
      updateValues.push(city);
    }
    if (state) {
      updateFields.push('state = ?');
      updateValues.push(state);
    }
    if (country) {
      updateFields.push('country = ?');
      updateValues.push(country);
    }
    if (phone) {
      updateFields.push('phone = ?');
      updateValues.push(phone);
    }
    if (email) {
      updateFields.push('email = ?');
      updateValues.push(email);
    }
    if (website) {
      updateFields.push('website = ?');
      updateValues.push(website);
    }
    if (license_number) {
      updateFields.push('license_number = ?');
      updateValues.push(license_number);
    }
    if (capacity) {
      updateFields.push('capacity = ?');
      updateValues.push(capacity);
    }
    if (typeof is_active === 'boolean') {
      updateFields.push('is_active = ?');
      updateValues.push(is_active);
    }

    if (updateFields.length === 0) {
      return res.status(400).json({
        error: 'No fields to update',
        message: 'Please provide at least one field to update'
      });
    }

    updateValues.push(id);

    await executeQuery(
      `UPDATE hospitals SET ${updateFields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      updateValues
    );

    const updatedHospital = await executeQuery(
      'SELECT * FROM hospitals WHERE id = ?',
      [id]
    );

    res.json({
      message: 'Hospital updated successfully',
      hospital: updatedHospital[0]
    });

  } catch (error) {
    console.error('Update hospital error:', error);
    res.status(500).json({
      error: 'Failed to update hospital',
      message: 'An error occurred while updating hospital'
    });
  }
});

// Delete hospital
router.delete('/hospitals/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Check if hospital exists
    const hospital = await executeQuery(
      'SELECT id FROM hospitals WHERE id = ?',
      [id]
    );

    if (hospital.length === 0) {
      return res.status(404).json({
        error: 'Hospital not found',
        message: 'Hospital does not exist'
      });
    }

    // Check if hospital has associated users
    const associatedUsers = await executeQuery(
      `SELECT COUNT(*) as count FROM users u 
       LEFT JOIN hospital_admins ha ON u.id = ha.user_id 
       LEFT JOIN doctors d ON u.id = d.user_id 
       WHERE ha.hospital_id = ? OR d.hospital_id = ?`,
      [id, id]
    );

    if (associatedUsers[0].count > 0) {
      return res.status(400).json({
        error: 'Cannot delete hospital',
        message: 'Hospital has associated users. Please reassign or remove users first.'
      });
    }

    await executeQuery('DELETE FROM hospitals WHERE id = ?', [id]);

    res.json({
      message: 'Hospital deleted successfully'
    });

  } catch (error) {
    console.error('Delete hospital error:', error);
    res.status(500).json({
      error: 'Failed to delete hospital',
      message: 'An error occurred while deleting hospital'
    });
  }
});

// ==================== HOSPITAL ADMIN MANAGEMENT ====================

// Create hospital admin
router.post('/hospital-admins', async (req, res) => {
  try {
    const {
      hospital_id,
      email,
      phone_number,
      password,
      full_name,
      position = 'Hospital Administrator',
      permissions = ['manage_doctors', 'view_reports', 'manage_patients'],
      date_of_birth,
      gender
    } = req.body;

    if (!hospital_id || !email || !phone_number || !password || !full_name) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'Please provide hospital ID, email, phone, password, and full name'
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

    // Hash password
    const bcrypt = await import('bcryptjs');
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Generate user ID
    const userId = `HOSP_ADMIN_${uuidv4().replace(/-/g, '').substring(0, 8)}`;

    // Create user and hospital admin in transaction
    const queries = [
      {
        query: `INSERT INTO users (id, role, email, phone_number, password_hash, full_name, date_of_birth, gender) 
                VALUES (?, 'hospital_admin', ?, ?, ?, ?, ?, ?)`,
        params: [userId, email, phone_number, passwordHash, full_name, date_of_birth, gender]
      },
      {
        query: `INSERT INTO hospital_admins (id, user_id, hospital_id, position, permissions) 
                VALUES (?, ?, ?, ?, ?)`,
        params: [`HA_${uuidv4().replace(/-/g, '').substring(0, 8)}`, userId, hospital_id, position, JSON.stringify(permissions)]
      }
    ];

    await executeTransaction(queries);

    const newHospitalAdmin = await executeQuery(
      `SELECT ha.*, u.full_name, u.email, u.phone_number, h.name as hospital_name 
       FROM hospital_admins ha 
       JOIN users u ON ha.user_id = u.id 
       JOIN hospitals h ON ha.hospital_id = h.id 
       WHERE ha.user_id = ?`,
      [userId]
    );

    res.status(201).json({
      message: 'Hospital admin created successfully',
      hospitalAdmin: newHospitalAdmin[0]
    });

  } catch (error) {
    console.error('Create hospital admin error:', error);
    res.status(500).json({
      error: 'Failed to create hospital admin',
      message: 'An error occurred while creating hospital admin'
    });
  }
});

// Get all hospital admins
router.get('/hospital-admins', async (req, res) => {
  try {
    const { page = 1, limit = 10, hospital_id = '', search = '' } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = '';
    let params = [];

    if (hospital_id) {
      whereClause += 'WHERE ha.hospital_id = ?';
      params.push(hospital_id);
    }

    if (search) {
      const searchCondition = 'u.full_name LIKE ? OR u.email LIKE ? OR u.phone_number LIKE ?';
      whereClause += whereClause ? ' AND (' + searchCondition + ')' : 'WHERE ' + searchCondition;
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    // Get total count
    const countResult = await executeQuery(
      `SELECT COUNT(*) as total FROM hospital_admins ha 
       JOIN users u ON ha.user_id = u.id 
       JOIN hospitals h ON ha.hospital_id = h.id 
       ${whereClause}`,
      params
    );
    const total = countResult[0].total;

    // Get hospital admins with pagination
    const hospitalAdmins = await executeQuery(
      `SELECT ha.*, u.full_name, u.email, u.phone_number, u.is_active, u.is_verified,
              h.name as hospital_name, h.address as hospital_address
       FROM hospital_admins ha 
       JOIN users u ON ha.user_id = u.id 
       JOIN hospitals h ON ha.hospital_id = h.id 
       ${whereClause} 
       ORDER BY u.full_name ASC LIMIT ? OFFSET ?`,
      [...params, parseInt(limit), offset]
    );

    res.json({
      hospitalAdmins,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get hospital admins error:', error);
    res.status(500).json({
      error: 'Failed to fetch hospital admins',
      message: 'An error occurred while fetching hospital admins'
    });
  }
});

// Update hospital admin
router.put('/hospital-admins/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      position,
      permissions,
      hospital_id
    } = req.body;

    // Check if hospital admin exists
    const hospitalAdmin = await executeQuery(
      'SELECT id FROM hospital_admins WHERE id = ?',
      [id]
    );

    if (hospitalAdmin.length === 0) {
      return res.status(404).json({
        error: 'Hospital admin not found',
        message: 'Hospital admin does not exist'
      });
    }

    // Check if new hospital exists (if changing hospital)
    if (hospital_id) {
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
    }

    const updateFields = [];
    const updateValues = [];

    if (position) {
      updateFields.push('position = ?');
      updateValues.push(position);
    }
    if (permissions) {
      updateFields.push('permissions = ?');
      updateValues.push(JSON.stringify(permissions));
    }
    if (hospital_id) {
      updateFields.push('hospital_id = ?');
      updateValues.push(hospital_id);
    }

    if (updateFields.length === 0) {
      return res.status(400).json({
        error: 'No fields to update',
        message: 'Please provide at least one field to update'
      });
    }

    updateValues.push(id);

    await executeQuery(
      `UPDATE hospital_admins SET ${updateFields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      updateValues
    );

    const updatedHospitalAdmin = await executeQuery(
      `SELECT ha.*, u.full_name, u.email, u.phone_number, h.name as hospital_name 
       FROM hospital_admins ha 
       JOIN users u ON ha.user_id = u.id 
       JOIN hospitals h ON ha.hospital_id = h.id 
       WHERE ha.id = ?`,
      [id]
    );

    res.json({
      message: 'Hospital admin updated successfully',
      hospitalAdmin: updatedHospitalAdmin[0]
    });

  } catch (error) {
    console.error('Update hospital admin error:', error);
    res.status(500).json({
      error: 'Failed to update hospital admin',
      message: 'An error occurred while updating hospital admin'
    });
  }
});

// Delete hospital admin
router.delete('/hospital-admins/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Check if hospital admin exists
    const hospitalAdmin = await executeQuery(
      'SELECT user_id FROM hospital_admins WHERE id = ?',
      [id]
    );

    if (hospitalAdmin.length === 0) {
      return res.status(404).json({
        error: 'Hospital admin not found',
        message: 'Hospital admin does not exist'
      });
    }

    const userId = hospitalAdmin[0].user_id;

    // Delete hospital admin and user in transaction
    const queries = [
      {
        query: 'DELETE FROM hospital_admins WHERE id = ?',
        params: [id]
      },
      {
        query: 'DELETE FROM users WHERE id = ?',
        params: [userId]
      }
    ];

    await executeTransaction(queries);

    res.json({
      message: 'Hospital admin deleted successfully'
    });

  } catch (error) {
    console.error('Delete hospital admin error:', error);
    res.status(500).json({
      error: 'Failed to delete hospital admin',
      message: 'An error occurred while deleting hospital admin'
    });
  }
});

// ==================== USER MANAGEMENT ====================

// Get all users
router.get('/users', async (req, res) => {
  try {
    const { page = 1, limit = 10, role = '', search = '', status = 'all' } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = '';
    let params = [];

    if (role) {
      whereClause += 'WHERE role = ?';
      params.push(role);
    }

    if (search) {
      const searchCondition = 'full_name LIKE ? OR email LIKE ? OR phone_number LIKE ?';
      whereClause += whereClause ? ' AND (' + searchCondition + ')' : 'WHERE ' + searchCondition;
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    if (status !== 'all') {
      const statusCondition = status === 'active' ? 'is_active = 1' : 'is_active = 0';
      whereClause += whereClause ? ' AND ' + statusCondition : 'WHERE ' + statusCondition;
    }

    // Get total count
    const countResult = await executeQuery(
      `SELECT COUNT(*) as total FROM users ${whereClause}`,
      params
    );
    const total = countResult[0].total;

    // Get users with pagination
    const users = await executeQuery(
      `SELECT id, role, email, phone_number, full_name, is_active, is_verified, created_at, last_login 
       FROM users ${whereClause} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      [...params, parseInt(limit), offset]
    );

    res.json({
      users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      error: 'Failed to fetch users',
      message: 'An error occurred while fetching users'
    });
  }
});

// Get user details
router.get('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const user = await executeQuery(
      `SELECT u.*, 
              CASE 
                WHEN u.role = 'patient' THEN p.id 
                WHEN u.role = 'doctor' THEN d.id 
                WHEN u.role = 'hospital_admin' THEN ha.id 
                ELSE NULL 
              END as profile_id
       FROM users u 
       LEFT JOIN patients p ON u.id = p.user_id 
       LEFT JOIN doctors d ON u.id = d.user_id 
       LEFT JOIN hospital_admins ha ON u.id = ha.user_id 
       WHERE u.id = ?`,
      [id]
    );

    if (user.length === 0) {
      return res.status(404).json({
        error: 'User not found',
        message: 'User does not exist'
      });
    }

    const userData = user[0];

    // Get additional profile data based on role
    let profileData = {};
    if (userData.profile_id) {
      switch (userData.role) {
        case 'patient':
          const patientData = await executeQuery(
            'SELECT * FROM patients WHERE id = ?',
            [userData.profile_id]
          );
          profileData = patientData[0] || {};
          break;
        case 'doctor':
          const doctorData = await executeQuery(
            'SELECT d.*, h.name as hospital_name FROM doctors d LEFT JOIN hospitals h ON d.hospital_id = h.id WHERE d.id = ?',
            [userData.profile_id]
          );
          profileData = doctorData[0] || {};
          break;
        case 'hospital_admin':
          const adminData = await executeQuery(
            'SELECT ha.*, h.name as hospital_name FROM hospital_admins ha LEFT JOIN hospitals h ON ha.hospital_id = h.id WHERE ha.id = ?',
            [userData.profile_id]
          );
          profileData = adminData[0] || {};
          break;
      }
    }

    res.json({
      user: {
        ...userData,
        profile: profileData
      }
    });

  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      error: 'Failed to fetch user',
      message: 'An error occurred while fetching user'
    });
  }
});

// Update user status
router.patch('/users/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { is_active, is_verified } = req.body;

    // Check if user exists
    const user = await executeQuery(
      'SELECT id FROM users WHERE id = ?',
      [id]
    );

    if (user.length === 0) {
      return res.status(404).json({
        error: 'User not found',
        message: 'User does not exist'
      });
    }

    const updateFields = [];
    const updateValues = [];

    if (typeof is_active === 'boolean') {
      updateFields.push('is_active = ?');
      updateValues.push(is_active);
    }

    if (typeof is_verified === 'boolean') {
      updateFields.push('is_verified = ?');
      updateValues.push(is_verified);
    }

    if (updateFields.length === 0) {
      return res.status(400).json({
        error: 'No status fields to update',
        message: 'Please provide is_active or is_verified'
      });
    }

    updateValues.push(id);

    await executeQuery(
      `UPDATE users SET ${updateFields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      updateValues
    );

    res.json({
      message: 'User status updated successfully'
    });

  } catch (error) {
    console.error('Update user status error:', error);
    res.status(500).json({
      error: 'Failed to update user status',
      message: 'An error occurred while updating user status'
    });
  }
});

// Delete user
router.delete('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Check if user exists
    const user = await executeQuery(
      'SELECT id, role FROM users WHERE id = ?',
      [id]
    );

    if (user.length === 0) {
      return res.status(404).json({
        error: 'User not found',
        message: 'User does not exist'
      });
    }

    // Prevent deletion of super admin
    if (user[0].role === 'super_admin') {
      return res.status(403).json({
        error: 'Cannot delete super admin',
        message: 'Super admin accounts cannot be deleted'
      });
    }

    // Delete user (cascade will handle related records)
    await executeQuery('DELETE FROM users WHERE id = ?', [id]);

    res.json({
      message: 'User deleted successfully'
    });

  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      error: 'Failed to delete user',
      message: 'An error occurred while deleting user'
    });
  }
});

// ==================== SYSTEM SETTINGS ====================

// Get system settings
router.get('/settings', async (req, res) => {
  try {
    const settings = await executeQuery('SELECT * FROM system_settings ORDER BY setting_key');

    const formattedSettings = {};
    settings.forEach(setting => {
      formattedSettings[setting.setting_key] = {
        value: setting.setting_value,
        description: setting.description,
        updated_at: setting.updated_at
      };
    });

    res.json({
      settings: formattedSettings
    });

  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({
      error: 'Failed to fetch settings',
      message: 'An error occurred while fetching settings'
    });
  }
});

// Update system settings
router.put('/settings', async (req, res) => {
  try {
    const { settings } = req.body;

    if (!settings || typeof settings !== 'object') {
      return res.status(400).json({
        error: 'Invalid settings',
        message: 'Please provide valid settings object'
      });
    }

    const updateQueries = [];
    for (const [key, value] of Object.entries(settings)) {
      updateQueries.push({
        query: 'UPDATE system_settings SET setting_value = ?, updated_at = CURRENT_TIMESTAMP WHERE setting_key = ?',
        params: [value, key]
      });
    }

    await executeTransaction(updateQueries);

    res.json({
      message: 'Settings updated successfully'
    });

  } catch (error) {
    console.error('Update settings error:', error);
    res.status(500).json({
      error: 'Failed to update settings',
      message: 'An error occurred while updating settings'
    });
  }
});

// ==================== SYSTEM STATISTICS ====================

// Get system statistics
router.get('/statistics', async (req, res) => {
  try {
    const [
      totalUsers,
      totalHospitals,
      totalAppointments,
      totalConsultations,
      usersByRole,
      recentActivity
    ] = await Promise.all([
      executeQuery('SELECT COUNT(*) as count FROM users'),
      executeQuery('SELECT COUNT(*) as count FROM hospitals'),
      executeQuery('SELECT COUNT(*) as count FROM appointments'),
      executeQuery('SELECT COUNT(*) as count FROM consultations'),
      executeQuery('SELECT role, COUNT(*) as count FROM users GROUP BY role'),
      executeQuery(`
        SELECT 'user' as type, full_name as name, created_at as date FROM users 
        WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
        UNION ALL
        SELECT 'appointment' as type, CONCAT('Appointment #', id) as name, created_at as date FROM appointments 
        WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
        ORDER BY date DESC LIMIT 10
      `)
    ]);

    res.json({
      statistics: {
        totalUsers: totalUsers[0].count,
        totalHospitals: totalHospitals[0].count,
        totalAppointments: totalAppointments[0].count,
        totalConsultations: totalConsultations[0].count,
        usersByRole: usersByRole.reduce((acc, item) => {
          acc[item.role] = item.count;
          return acc;
        }, {}),
        recentActivity
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