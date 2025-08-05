import express from 'express';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { executeQuery, executeTransaction } from '../database/connection.js';
import { generateToken, authenticateToken, rateLimiter } from '../middleware/auth.js';
import { logRequest } from '../middleware/auth.js';

const router = express.Router();

// Apply rate limiting to all auth routes
router.use(rateLimiter(15 * 60 * 1000, 50)); // 50 requests per 15 minutes
router.use(logRequest);

// Register new user
router.post('/register', async (req, res) => {
  try {
    const { 
      email, 
      phone_number, 
      password, 
      full_name, 
      role, 
      fayda_id,
      date_of_birth,
      gender,
      blood_type,
      emergency_contact_name,
      emergency_contact_phone,
      emergency_contact_relationship
    } = req.body;

    // Validation
    if (!email || !phone_number || !password || !full_name || !role) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'Please provide all required information'
      });
    }

    if (!['super_admin', 'hospital_admin', 'doctor', 'patient'].includes(role)) {
      return res.status(400).json({
        error: 'Invalid role',
        message: 'Role must be one of: super_admin, hospital_admin, doctor, patient'
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
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Generate user ID
    const userId = `${role.toUpperCase()}_${uuidv4().replace(/-/g, '').substring(0, 8)}`;

    // Use transaction for user and profile creation
    const queries = [
      {
        query: `INSERT INTO users (id, fayda_id, role, email, phone_number, password_hash, full_name, date_of_birth, gender) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        params: [userId, fayda_id, role, email, phone_number, passwordHash, full_name, date_of_birth, gender]
      }
    ];

    // If registering as patient, create patient profile
    if (role === 'patient') {
      queries.push({
        query: `INSERT INTO patients (user_id, blood_type, emergency_contact_name, emergency_contact_phone, emergency_contact_relationship) 
                VALUES (?, ?, ?, ?, ?)`,
        params: [userId, blood_type, emergency_contact_name, emergency_contact_phone, emergency_contact_relationship]
      });
    }

    // Execute transaction
    await executeTransaction(queries);

    // Get the created user
    const newUser = await executeQuery(
      'SELECT id, role, email, full_name, is_active, is_verified FROM users WHERE id = ?',
      [userId]
    );

    // Generate token
    const token = generateToken(newUser[0]);

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: newUser[0].id,
        role: newUser[0].role,
        email: newUser[0].email,
        full_name: newUser[0].full_name
      },
      token
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      error: 'Registration failed',
      message: 'An error occurred during registration'
    });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, phone_number, password } = req.body;

    // Validation
    if (!password || (!email && !phone_number)) {
      return res.status(400).json({
        error: 'Missing credentials',
        message: 'Please provide email/phone and password'
      });
    }

    // Find user by email or phone
    const whereClause = email ? 'email = ?' : 'phone_number = ?';
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
       WHERE ${whereClause}`,
      [email || phone_number]
    );

    if (user.length === 0) {
      return res.status(401).json({
        error: 'Invalid credentials',
        message: 'Email/phone or password is incorrect'
      });
    }

    const userData = user[0];

    // Check if account is active
    if (!userData.is_active) {
      return res.status(401).json({
        error: 'Account deactivated',
        message: 'Your account has been deactivated'
      });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, userData.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({
        error: 'Invalid credentials',
        message: 'Email/phone or password is incorrect'
      });
    }

    // Update last login
    await executeQuery(
      'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?',
      [userData.id]
    );

    // Generate token
    const token = generateToken(userData);

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
      message: 'Login successful',
      user: {
        id: userData.id,
        role: userData.role,
        email: userData.email,
        full_name: userData.full_name,
        is_verified: userData.is_verified,
        profile: profileData
      },
      token
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      error: 'Login failed',
      message: 'An error occurred during login'
    });
  }
});

// Change password
router.post('/change-password', authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        error: 'Missing passwords',
        message: 'Please provide current and new password'
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        error: 'Weak password',
        message: 'Password must be at least 8 characters long'
      });
    }

    // Get current user with password
    const user = await executeQuery(
      'SELECT password_hash FROM users WHERE id = ?',
      [req.user.id]
    );

    if (user.length === 0) {
      return res.status(404).json({
        error: 'User not found',
        message: 'User account not found'
      });
    }

    // Verify current password
    const isValidPassword = await bcrypt.compare(currentPassword, user[0].password_hash);
    if (!isValidPassword) {
      return res.status(401).json({
        error: 'Invalid current password',
        message: 'Current password is incorrect'
      });
    }

    // Hash new password
    const saltRounds = 12;
    const newPasswordHash = await bcrypt.hash(newPassword, saltRounds);

    // Update password
    await executeQuery(
      'UPDATE users SET password_hash = ? WHERE id = ?',
      [newPasswordHash, req.user.id]
    );

    res.json({
      message: 'Password changed successfully'
    });

  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      error: 'Password change failed',
      message: 'An error occurred while changing password'
    });
  }
});

// Get current user profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
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
      [req.user.id]
    );

    if (user.length === 0) {
      return res.status(404).json({
        error: 'User not found',
        message: 'User profile not found'
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
        id: userData.id,
        role: userData.role,
        email: userData.email,
        full_name: userData.full_name,
        phone_number: userData.phone_number,
        date_of_birth: userData.date_of_birth,
        gender: userData.gender,
        profile_picture: userData.profile_picture,
        is_verified: userData.is_verified,
        created_at: userData.created_at,
        last_login: userData.last_login,
        profile: profileData
      }
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      error: 'Failed to get profile',
      message: 'An error occurred while fetching profile'
    });
  }
});

// Update user profile
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { full_name, phone_number, date_of_birth, gender, profile_picture } = req.body;

    const updateFields = [];
    const updateValues = [];

    if (full_name) {
      updateFields.push('full_name = ?');
      updateValues.push(full_name);
    }

    if (phone_number) {
      // Check if phone number is already taken by another user
      const existingUser = await executeQuery(
        'SELECT id FROM users WHERE phone_number = ? AND id != ?',
        [phone_number, req.user.id]
      );

      if (existingUser.length > 0) {
        return res.status(409).json({
          error: 'Phone number already exists',
          message: 'This phone number is already registered by another user'
        });
      }

      updateFields.push('phone_number = ?');
      updateValues.push(phone_number);
    }

    if (date_of_birth) {
      updateFields.push('date_of_birth = ?');
      updateValues.push(date_of_birth);
    }

    if (gender) {
      updateFields.push('gender = ?');
      updateValues.push(gender);
    }

    if (profile_picture) {
      updateFields.push('profile_picture = ?');
      updateValues.push(profile_picture);
    }

    if (updateFields.length === 0) {
      return res.status(400).json({
        error: 'No fields to update',
        message: 'Please provide at least one field to update'
      });
    }

    updateValues.push(req.user.id);

    await executeQuery(
      `UPDATE users SET ${updateFields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      updateValues
    );

    res.json({
      message: 'Profile updated successfully'
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      error: 'Profile update failed',
      message: 'An error occurred while updating profile'
    });
  }
});

// Logout (client-side token removal)
router.post('/logout', authenticateToken, async (req, res) => {
  try {
    // In a real application, you might want to blacklist the token
    // For now, we'll just return success
    res.json({
      message: 'Logged out successfully'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      error: 'Logout failed',
      message: 'An error occurred during logout'
    });
  }
});

// Verify token endpoint
router.get('/verify', authenticateToken, async (req, res) => {
  res.json({
    message: 'Token is valid',
    user: {
      id: req.user.id,
      role: req.user.role,
      email: req.user.email,
      full_name: req.user.full_name
    }
  });
});

export default router; 