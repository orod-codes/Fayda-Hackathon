import 'dotenv/config';
import express from 'express';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import fetch from 'node-fetch';
import { v4 as uuidv4 } from 'uuid';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import { WebSocketServer } from 'ws';
import http from 'http';
import db from './db.js';
import { isAuthenticated, isPatient, isDoctor, isHospitalAdmin, isSuperAdmin, isAdmin } from './middleware/auth.js';
import { encrypt, decrypt, validateEncryptionKey } from './utils/encryption.js';
import { extractMedicalEntities, generateChatResponse, generateSessionSummary } from './services/ai.js';

const app = express();
const server = http.createServer(app);

// --- Initialize WebSocket Server ---
const wss = new WebSocketServer({ server });

// WebSocket connection handling
wss.on('connection', (ws) => {
  console.log('New WebSocket connection established');

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      handleWebSocketMessage(ws, data);
    } catch (error) {
      console.error('WebSocket message error:', error);
    }
  });

  ws.on('close', () => {
    console.log('WebSocket connection closed');
  });
});

// WebSocket message handling
const rooms = new Map();

function handleWebSocketMessage(ws, data) {
  switch (data.type) {
    case 'join-room':
      handleJoinRoom(ws, data);
      break;
    case 'offer':
    case 'answer':
    case 'ice-candidate':
      handleRelayMessage(ws, data);
      break;
    default:
      console.log('Unknown message type:', data.type);
  }
}

function handleJoinRoom(ws, data) {
  const { roomId, userId } = data;
  
  if (!rooms.has(roomId)) {
    rooms.set(roomId, new Set());
  }
  
  rooms.get(roomId).add(ws);
  ws.roomId = roomId;
  ws.userId = userId;
  
  console.log(`User ${userId} joined room ${roomId}`);
  
  // Notify other users in the room
  rooms.get(roomId).forEach((client) => {
    if (client !== ws && client.readyState === 1) {
      client.send(JSON.stringify({
        type: 'user-joined',
        userId: userId
      }));
    }
  });
}

function handleRelayMessage(ws, data) {
  const { roomId } = data;
  
  if (rooms.has(roomId)) {
    rooms.get(roomId).forEach((client) => {
      if (client !== ws && client.readyState === 1) {
        client.send(JSON.stringify(data));
      }
    });
  }
}

// --- Initialize encryption ---
validateEncryptionKey();

// --- Middleware Setup ---
app.use(morgan('dev'));
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());
app.use(session({
  secret: process.env.SESSION_SECRET || crypto.randomBytes(32).toString('hex'),
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: process.env.NODE_ENV === 'production', 
    httpOnly: true, 
    maxAge: 24 * 60 * 60 * 1000, 
    sameSite: 'lax'
  },
  name: 'hakim.sid'
}));

// --- Helper Functions ---
const base64URLEncode = (buffer) => {
  return buffer.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
};

const generateClientAssertion = () => {
  const privateKey = JSON.parse(Buffer.from(process.env.PRIVATE_KEY, 'base64').toString('utf-8'));
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    iss: process.env.CLIENT_ID,
    sub: process.env.CLIENT_ID,
    aud: process.env.TOKEN_ENDPOINT,
    jti: uuidv4(),
    exp: now + 10 * 60, // 10 minutes
    iat: now,
  };
  return jwt.sign(payload, privateKey, { algorithm: process.env.ALGORITHM, keyid: privateKey.kid });
};

// Role assignment logic based on FAN
const assignUserRole = (faydaId) => {
  if (faydaId === '6230247319356120') {
    return 'doctor';
  } else if (faydaId === '3126894653473958') {
    return 'patient';
  } else {
    return 'patient'; // Default role
  }
};

// --- Authentication Routes ---
app.get('/api/auth/login-url', (req, res) => {
  const codeVerifier = base64URLEncode(crypto.randomBytes(32));
  const codeChallenge = base64URLEncode(crypto.createHash('sha256').update(codeVerifier).digest());
  const state = base64URLEncode(crypto.randomBytes(16));

  req.session.codeVerifier = codeVerifier;
  req.session.state = state;

  const claims = {
    userinfo: {
      name: { essential: true },
      phone_number: { essential: true },
      email: { essential: true },
      picture: { essential: true },
      gender: { essential: true },
      birthdate: { essential: true },
      address: { essential: true }
    },
    id_token: {}
  };

  const authUrl = new URL(process.env.AUTHORIZATION_ENDPOINT);
  authUrl.searchParams.append('client_id', process.env.CLIENT_ID);
  authUrl.searchParams.append('response_type', 'code');
  authUrl.searchParams.append('redirect_uri', process.env.REDIRECT_URI);
  authUrl.searchParams.append('scope', 'openid profile email');
  authUrl.searchParams.append('state', state);
  authUrl.searchParams.append('code_challenge', codeChallenge);
  authUrl.searchParams.append('code_challenge_method', 'S256');
  authUrl.searchParams.append('acr_values', 'mosip:idp:acr:generated-code');
  authUrl.searchParams.append('claims', JSON.stringify(claims));

  res.json({ authorizationUrl: authUrl.toString() });
});

app.post('/api/auth/callback', async (req, res, next) => {
  try {
    const { authorization_code, state: clientState } = req.body;
    const { codeVerifier, state: sessionState } = req.session;

    if (clientState !== sessionState) {
      return res.status(403).json({ error: 'Invalid state parameter', details: 'CSRF attack suspected.' });
    }

    const clientAssertion = generateClientAssertion();

    const tokenResponse = await fetch(process.env.TOKEN_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: authorization_code,
        redirect_uri: process.env.REDIRECT_URI,
        client_id: process.env.CLIENT_ID,
        client_assertion: clientAssertion,
        client_assertion_type: process.env.CLIENT_ASSERTION_TYPE,
        code_verifier: codeVerifier,
      }),
    });

    const tokenData = await tokenResponse.json();

    if (tokenData.error) {
      console.error('Token Exchange Error:', tokenData);
      return res.status(400).json({ error: 'Token exchange failed', details: tokenData.error_description });
    }

    const userInfoResponse = await fetch(process.env.USERINFO_ENDPOINT, {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });

    if (!userInfoResponse.ok) {
      return res.status(userInfoResponse.status).json({ error: 'Failed to fetch user info' });
    }

    const userInfo = await userInfoResponse.json();
    
    // Assign role based on FAN
    const assignedRole = assignUserRole(userInfo.sub);
    
    // Check if user exists in database
    let user = await db.queryOne(
      'SELECT id, fayda_id, role FROM users WHERE fayda_id = ?',
      [userInfo.sub]
    );

    if (!user) {
      // Create new user with assigned role
      const result = await db.query(
        'INSERT INTO users (fayda_id, role) VALUES (?, ?)',
        [userInfo.sub, assignedRole]
      );
      user = {
        id: result.insertId,
        fayda_id: userInfo.sub,
        role: assignedRole
      };
    } else {
      // Update role if it has changed
      if (user.role !== assignedRole) {
        await db.query(
          'UPDATE users SET role = ? WHERE id = ?',
          [assignedRole, user.id]
        );
        user.role = assignedRole;
      }
    }

    // Update or create personal information (SQLite doesn't support ON DUPLICATE KEY UPDATE)
    await db.query(
      `INSERT OR REPLACE INTO personal_information (user_id, full_name, date_of_birth, gender, photo_url) 
       VALUES (?, ?, ?, ?, ?)`,
      [
        user.id,
        userInfo.name,
        userInfo.birthdate,
        userInfo.gender,
        userInfo.picture
      ]
    );

    // Set session
    req.session.userId = user.id;
    req.session.user = { ...userInfo, role: user.role };

    res.json({ 
      success: true, 
      user: { 
        id: user.id,
        fayda_id: user.fayda_id,
        role: user.role,
        ...userInfo 
      } 
    });
  } catch (error) {
    next(error);
  }
});

// --- User Routes (Authenticated) ---
app.get('/api/users/me', isAuthenticated, (req, res) => {
  res.json({ 
    id: req.user.id,
    fayda_id: req.user.fayda_id,
    role: req.user.role
  });
});

// --- Demo Login Routes for Hospital Admin and Super Admin ---
app.post('/api/auth/demo-login', async (req, res, next) => {
  try {
    const { username, password, role } = req.body;
    
    // Demo credentials
    const demoCredentials = {
      hospital_admin: { username: 'hospital_admin', password: 'hospital123' },
      super_admin: { username: 'super_admin', password: 'super123' }
    };
    
    if (!demoCredentials[role] || 
        demoCredentials[role].username !== username || 
        demoCredentials[role].password !== password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Create or get demo user
    let user = await db.queryOne(
      'SELECT id, fayda_id, role FROM users WHERE fayda_id = ?',
      [`DEMO_${role.toUpperCase()}`]
    );
    
    if (!user) {
      const result = await db.query(
        'INSERT INTO users (fayda_id, role, status) VALUES (?, ?, ?)',
        [`DEMO_${role.toUpperCase()}`, role, 'approved']
      );
      user = {
        id: result.insertId,
        fayda_id: `DEMO_${role.toUpperCase()}`,
        role: role
      };
      
      // Add demo personal information
      await db.query(
        'INSERT INTO personal_information (user_id, full_name) VALUES (?, ?)',
        [user.id, role === 'hospital_admin' ? 'Hospital Administrator' : 'Super Administrator']
      );
    }
    
    // Set session
    req.session.userId = user.id;
    req.session.user = { role: user.role };
    
    res.json({ 
      success: true, 
      user: { 
        id: user.id,
        fayda_id: user.fayda_id,
        role: user.role
      } 
    });
  } catch (error) {
    next(error);
  }
});

// --- Doctor Registration Route ---
app.post('/api/auth/doctor/register', async (req, res, next) => {
  try {
    const { authorization_code, state: clientState, license_number } = req.body;
    const { codeVerifier, state: sessionState } = req.session;

    if (clientState !== sessionState) {
      return res.status(403).json({ error: 'Invalid state parameter', details: 'CSRF attack suspected.' });
    }

    if (!license_number) {
      return res.status(400).json({ error: 'License number is required for doctor registration' });
    }

    const clientAssertion = generateClientAssertion();

    const tokenResponse = await fetch(process.env.TOKEN_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: authorization_code,
        redirect_uri: process.env.REDIRECT_URI,
        client_id: process.env.CLIENT_ID,
        client_assertion: clientAssertion,
        client_assertion_type: process.env.CLIENT_ASSERTION_TYPE,
        code_verifier: codeVerifier,
      }),
    });

    const tokenData = await tokenResponse.json();

    if (tokenData.error) {
      console.error('Token Exchange Error:', tokenData);
      return res.status(400).json({ error: 'Token exchange failed', details: tokenData.error_description });
    }

    const userInfoResponse = await fetch(process.env.USERINFO_ENDPOINT, {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });

    if (!userInfoResponse.ok) {
      return res.status(userInfoResponse.status).json({ error: 'Failed to fetch user info' });
    }

    const userInfo = await userInfoResponse.json();
    
    // Check if user already exists
    const existingUser = await db.queryOne(
      'SELECT id, role, status FROM users WHERE fayda_id = ?',
      [userInfo.sub]
    );
    
    if (existingUser) {
      if (existingUser.role === 'doctor') {
        return res.status(409).json({ 
          error: 'Doctor already registered', 
          status: existingUser.status 
        });
      } else {
        return res.status(409).json({ 
          error: 'User already exists with a different role' 
        });
      }
    }
    
    // Create pending doctor registration
    const result = await db.query(
      'INSERT INTO users (fayda_id, role, license_number, status) VALUES (?, ?, ?, ?)',
      [userInfo.sub, 'doctor', license_number, 'pending']
    );
    
    const userId = result.insertId;
    
    // Add personal information
    await db.query(
      'INSERT INTO personal_information (user_id, full_name, date_of_birth, gender, photo_url) VALUES (?, ?, ?, ?, ?)',
      [userId, userInfo.name, userInfo.birthdate, userInfo.gender, userInfo.picture]
    );
    
    res.json({ 
      success: true, 
      message: 'Doctor registration submitted. Awaiting approval.',
      status: 'pending'
    });
  } catch (error) {
    next(error);
  }
});

app.post('/api/auth/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to logout' });
    }
    res.clearCookie('hakim.sid');
    res.json({ success: true, message: 'Logged out successfully' });
  });
});

// --- Patient Routes (Protected by isAuthenticated and isPatient) ---
app.get('/api/patient/medical-records', isAuthenticated, isPatient, async (req, res, next) => {
  try {
    const records = await db.query(
      `SELECT mr.id, mr.record_type, mr.description, mr.is_verified_by_doctor, 
              mr.created_at, pi.full_name as created_by_name
       FROM medical_records mr
       LEFT JOIN users u ON mr.created_by_user_id = u.id
       LEFT JOIN personal_information pi ON u.id = pi.user_id
       WHERE mr.patient_id = ? 
       ORDER BY mr.created_at DESC`,
      [req.user.id]
    );
    res.json({ records });
  } catch (error) {
    next(error);
  }
});

app.get('/api/patient/chat-history', isAuthenticated, isPatient, async (req, res, next) => {
  try {
    const sessions = await db.query(
      'SELECT id, topic, created_at FROM Chat_Sessions WHERE user_id = ? ORDER BY created_at DESC',
      [req.user.id]
    );

    const sessionsWithMessages = await Promise.all(
      sessions.map(async (session) => {
        const messages = await db.query(
          'SELECT role, content_encrypted, timestamp FROM Chat_Messages WHERE session_id = ? ORDER BY timestamp',
          [session.id]
        );

        const decryptedMessages = messages.map(msg => ({
          role: msg.role,
          content: decrypt(msg.content_encrypted),
          timestamp: msg.timestamp
        }));

        return {
          ...session,
          messages: decryptedMessages
        };
      })
    );

    res.json({ sessions: sessionsWithMessages });
  } catch (error) {
    next(error);
  }
});

app.post('/api/patient/chat', isAuthenticated, isPatient, async (req, res, next) => {
  try {
    const { message, sessionId } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    let currentSessionId = sessionId;
    
    // Create new session if none provided
    if (!currentSessionId) {
      const sessionResult = await db.query(
        'INSERT INTO Chat_Sessions (user_id, topic) VALUES (?, ?)',
        [req.user.id, 'New consultation']
      );
      currentSessionId = sessionResult.insertId;
    }

    // Encrypt user message
    const encryptedUserMessage = encrypt(message);
    
    // Save user message
    await db.query(
      'INSERT INTO Chat_Messages (session_id, role, content_encrypted) VALUES (?, ?, ?)',
      [currentSessionId, 'user', encryptedUserMessage]
    );

    // Extract medical entities from message
    const entities = await extractMedicalEntities(message);
    
    // Add new medical records if entities found
    for (const entity of entities) {
      if (entity.confidence > 0.8) {
        await db.query(
          'INSERT INTO Medical_Records (patient_id, record_type, description, created_by_user_id, is_verified_by_doctor) VALUES (?, ?, ?, ?, ?)',
          [req.user.id, entity.type, entity.description, req.user.id, false]
        );
      }
    }

    // Generate AI response
    const aiResponse = await generateChatResponse(message, req.user.id, currentSessionId);
    const encryptedAiResponse = encrypt(aiResponse);
    
    // Save AI response
    await db.query(
      'INSERT INTO Chat_Messages (session_id, role, content_encrypted) VALUES (?, ?, ?)',
      [currentSessionId, 'assistant', encryptedAiResponse]
    );

    // Generate session summary if this is a new session
    if (!sessionId) {
      const summary = await generateSessionSummary(currentSessionId);
      if (summary) {
        await db.query(
          'UPDATE Chat_Sessions SET summary_encrypted = ? WHERE id = ?',
          [summary, currentSessionId]
        );
      }
    }

    res.json({ 
      response: aiResponse,
      sessionId: currentSessionId,
      entitiesFound: entities.length
    });
  } catch (error) {
    next(error);
  }
});

// --- Patient Document Management ---
app.post('/api/patient/upload-document', isAuthenticated, isPatient, async (req, res, next) => {
  try {
    const { originalName, documentType, description, filePath, fileSize, mimeType } = req.body;

    if (!originalName || !documentType || !filePath) {
      return res.status(400).json({ error: 'Filename, type, and path are required' });
    }

    const filename = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}_${originalName}`;

    const result = await db.query(
      'INSERT INTO patient_documents (patient_id, filename, original_name, document_type, description, file_path, file_size, mime_type) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [req.user.id, filename, originalName, documentType, description, filePath, fileSize, mimeType]
    );

    res.json({
      success: true,
      documentId: result.insertId,
      message: 'Document uploaded successfully'
    });
  } catch (error) {
    next(error);
  }
});

app.get('/api/patient/documents', isAuthenticated, isPatient, async (req, res, next) => {
  try {
    const documents = await db.query(
      `SELECT id, filename, original_name, document_type, description, file_size, 
              mime_type, uploaded_at, processed 
       FROM patient_documents
       WHERE patient_id = ?
       ORDER BY uploaded_at DESC`,
      [req.user.id]
    );

    res.json({ documents });
  } catch (error) {
    next(error);
  }
});

app.get('/api/patient/medical-record-export', isAuthenticated, isPatient, async (req, res, next) => {
  try {
    // Get complete medical record for export
    const patient = await db.queryOne(
      `SELECT u.fayda_id, pi.full_name, pi.date_of_birth, pi.gender
       FROM users u
       JOIN personal_information pi ON u.id = pi.user_id
       WHERE u.id = ?`,
      [req.user.id]
    );

    const records = await db.query(
      `SELECT mr.record_type, mr.description, mr.is_verified_by_doctor, mr.created_at,
              pi.full_name as created_by_name
       FROM medical_records mr
       LEFT JOIN users u ON mr.created_by_user_id = u.id
       LEFT JOIN personal_information pi ON u.id = pi.user_id
       WHERE mr.patient_id = ?
       ORDER BY mr.created_at DESC`,
      [req.user.id]
    );

    const documents = await db.query(
      `SELECT original_name, document_type, description, uploaded_at
       FROM patient_documents
       WHERE patient_id = ?
       ORDER BY uploaded_at DESC`,
      [req.user.id]
    );

    const consultations = await db.query(
      `SELECT cr.consultation_date, cr.diagnosis, cr.treatment_plan, cr.prescriptions,
              pi.full_name as doctor_name
       FROM consultation_reports cr
       JOIN users u ON cr.doctor_id = u.id
       JOIN personal_information pi ON u.id = pi.user_id
       WHERE cr.patient_id = ?
       ORDER BY cr.consultation_date DESC`,
      [req.user.id]
    );

    res.json({
      patient,
      records,
      documents,
      consultations,
      exportDate: new Date().toISOString()
    });
  } catch (error) {
    next(error);
  }
});

// --- Patient Medication Reminders ---
app.post('/api/patient/medication-reminder', isAuthenticated, isPatient, async (req, res, next) => {
  try {
    const { medicationName, dosage, frequency, timesPerDay, reminderTimes, startDate, endDate, notes } = req.body;

    if (!medicationName || !dosage || !frequency || !startDate) {
      return res.status(400).json({ error: 'Medication name, dosage, frequency, and start date are required' });
    }

    const result = await db.query(
      'INSERT INTO medication_reminders (patient_id, medication_name, dosage, frequency, times_per_day, reminder_times, start_date, end_date, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [req.user.id, medicationName, dosage, frequency, timesPerDay || 1, JSON.stringify(reminderTimes || []), startDate, endDate, notes]
    );

    res.json({
      success: true,
      reminderId: result.insertId,
      message: 'Medication reminder created successfully'
    });
  } catch (error) {
    next(error);
  }
});

app.get('/api/patient/medication-reminders', isAuthenticated, isPatient, async (req, res, next) => {
  try {
    const reminders = await db.query(
      `SELECT mr.*, pi.full_name as prescribed_by_name
       FROM medication_reminders mr
       LEFT JOIN users u ON mr.prescribed_by = u.id
       LEFT JOIN personal_information pi ON u.id = pi.user_id
       WHERE mr.patient_id = ? AND mr.is_active = 1
       ORDER BY mr.created_at DESC`,
      [req.user.id]
    );

    res.json({ reminders });
  } catch (error) {
    next(error);
  }
});

app.post('/api/patient/medication-log', isAuthenticated, isPatient, async (req, res, next) => {
  try {
    const { reminderId, scheduledTime, status, takenTime, notes } = req.body;

    if (!reminderId || !scheduledTime || !status) {
      return res.status(400).json({ error: 'Reminder ID, scheduled time, and status are required' });
    }

    const result = await db.query(
      'INSERT OR REPLACE INTO medication_logs (reminder_id, patient_id, scheduled_time, taken_time, status, notes) VALUES (?, ?, ?, ?, ?, ?)',
      [reminderId, req.user.id, scheduledTime, takenTime, status, notes]
    );

    res.json({
      success: true,
      message: 'Medication log updated successfully'
    });
  } catch (error) {
    next(error);
  }
});

// --- Patient Forms ---
app.post('/api/patient/submit-form', isAuthenticated, isPatient, async (req, res, next) => {
  try {
    const { formType, formData } = req.body;

    if (!formType || !formData) {
      return res.status(400).json({ error: 'Form type and data are required' });
    }

    const result = await db.query(
      'INSERT INTO patient_forms (patient_id, form_type, form_data) VALUES (?, ?, ?)',
      [req.user.id, formType, JSON.stringify(formData)]
    );

    res.json({
      success: true,
      formId: result.insertId,
      message: 'Form submitted successfully'
    });
  } catch (error) {
    next(error);
  }
});

// --- Doctor Routes (Protected by isAuthenticated and isDoctor) ---
app.get('/api/doctor/patient-summary/:patientId', isAuthenticated, isDoctor, async (req, res, next) => {
  try {
    const { patientId } = req.params;
    
    // Get patient's medical records
    const records = await db.query(
      `SELECT mr.id, mr.record_type, mr.description, mr.is_verified_by_doctor, 
              mr.created_at, pi.full_name as patient_name
       FROM Medical_Records mr
       JOIN Users u ON mr.patient_id = u.id
       JOIN Personal_Information pi ON u.id = pi.user_id
       WHERE u.id = ?
       ORDER BY mr.created_at DESC`,
      [patientId]
    );

    if (records.length === 0) {
      return res.status(404).json({ error: 'Patient not found or no records available' });
    }

    // Generate AI summary of the records
    const summaryData = records.map(record => ({
      type: record.record_type,
      description: record.description,
      verified: record.is_verified_by_doctor,
      date: record.created_at
    }));

    const summary = await generateSessionSummary(null, summaryData);
    
    res.json({ 
      patientName: records[0]?.patient_name,
      records: records,
      summary: summary
    });
  } catch (error) {
    next(error);
  }
});

app.post('/api/doctor/medical-record', isAuthenticated, isDoctor, async (req, res, next) => {
  try {
    const { patientId, recordType, description } = req.body;
    
    if (!patientId || !recordType || !description) {
      return res.status(400).json({ error: 'Patient ID, record type, and description are required' });
    }

    // Verify patient exists
    const patient = await db.queryOne(
      'SELECT id FROM Users WHERE id = ? AND role = ?',
      [patientId, 'patient']
    );

    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    // Add medical record with doctor verification
    const result = await db.query(
      'INSERT INTO Medical_Records (patient_id, record_type, description, created_by_user_id, is_verified_by_doctor) VALUES (?, ?, ?, ?, ?)',
      [patientId, recordType, description, req.user.id, true]
    );

    res.json({ 
      success: true, 
      recordId: result.insertId,
      message: 'Medical record added successfully' 
    });
  } catch (error) {
    next(error);
  }
});

// --- Doctor Availability Routes ---
app.post('/api/doctor/availability-rules', isAuthenticated, isDoctor, async (req, res, next) => {
  try {
    const { availabilityRules } = req.body;
    
    if (!Array.isArray(availabilityRules)) {
      return res.status(400).json({ error: 'Availability rules must be an array' });
    }

    // Delete existing rules for this doctor
    await db.query(
      'DELETE FROM Doctor_Availability_Rules WHERE doctor_id = ?',
      [req.user.id]
    );

    // Insert new rules
    for (const rule of availabilityRules) {
      await db.query(
        'INSERT INTO Doctor_Availability_Rules (doctor_id, day_of_week, start_time, end_time) VALUES (?, ?, ?, ?)',
        [req.user.id, rule.dayOfWeek, rule.startTime, rule.endTime]
      );
    }

    res.json({ success: true, message: 'Availability rules updated successfully' });
  } catch (error) {
    next(error);
  }
});

app.get('/api/doctor/:id/available-slots', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { start, end } = req.query;
    
    if (!start || !end) {
      return res.status(400).json({ error: 'Start and end dates are required' });
    }

    // Get doctor's availability rules
    const availabilityRules = await db.query(
      'SELECT day_of_week, start_time, end_time FROM Doctor_Availability_Rules WHERE doctor_id = ?',
      [id]
    );

    if (availabilityRules.length === 0) {
      return res.json({ availableSlots: [] });
    }

    // Get existing bookings
    const existingBookings = await db.query(
      'SELECT booking_time FROM Bookings WHERE doctor_id = ? AND status = ? AND booking_time BETWEEN ? AND ?',
      [id, 'confirmed', start, end]
    );

    const bookedTimes = new Set(existingBookings.map(booking => 
      new Date(booking.booking_time).toISOString()
    ));

    // Generate available slots
    const availableSlots = [];
    const startDate = new Date(start);
    const endDate = new Date(end);

    for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
      const dayOfWeek = date.getDay();
      
      const dayRules = availabilityRules.filter(rule => rule.day_of_week === dayOfWeek);
      
      for (const rule of dayRules) {
        const startTime = new Date(date);
        const [hours, minutes] = rule.start_time.split(':');
        startTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
        
        const endTime = new Date(date);
        const [endHours, endMinutes] = rule.end_time.split(':');
        endTime.setHours(parseInt(endHours), parseInt(endMinutes), 0, 0);
        
        // Generate 30-minute slots
        for (let slot = new Date(startTime); slot < endTime; slot.setMinutes(slot.getMinutes() + 30)) {
          const slotISO = slot.toISOString();
          if (!bookedTimes.has(slotISO)) {
            availableSlots.push({
              time: slotISO,
              formatted: slot.toLocaleString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })
            });
          }
        }
      }
    }

    res.json({ availableSlots });
  } catch (error) {
    next(error);
  }
});

// --- Booking Routes ---
app.post('/api/patient/book-appointment', isAuthenticated, isPatient, async (req, res, next) => {
  try {
    const { doctorId, hospitalId, bookingTime, appointmentType, phoneNumber, location, notes } = req.body;
    
    if (!doctorId || !bookingTime) {
      return res.status(400).json({ error: 'Doctor ID and booking time are required' });
    }

    // Verify doctor exists
    const doctor = await db.queryOne(
      'SELECT id FROM Users WHERE id = ? AND role = ?',
      [doctorId, 'doctor']
    );

    if (!doctor) {
      return res.status(404).json({ error: 'Doctor not found' });
    }

    // Check if slot is still available
    const existingBooking = await db.queryOne(
      'SELECT id FROM Bookings WHERE doctor_id = ? AND booking_time = ? AND status = ?',
      [doctorId, bookingTime, 'confirmed']
    );

    if (existingBooking) {
      return res.status(409).json({ error: 'This time slot is no longer available' });
    }

    // Create booking
    const videoRoomId = `room_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const result = await db.query(
      'INSERT INTO Bookings (patient_id, doctor_id, booking_time, video_room_id, status) VALUES (?, ?, ?, ?, ?)',
      [req.user.id, doctorId, bookingTime, videoRoomId, 'confirmed']
    );

    res.json({ 
      success: true, 
      bookingId: result.insertId,
      videoRoomId: videoRoomId,
      message: 'Appointment booked successfully' 
    });
  } catch (error) {
    next(error);
  }
});

app.get('/api/patient/bookings', isAuthenticated, isPatient, async (req, res, next) => {
  try {
    const bookings = await db.query(
      `SELECT b.id, b.booking_time, b.video_room_id, b.status,
              pi.full_name as doctor_name
       FROM Bookings b
       JOIN Users u ON b.doctor_id = u.id
       JOIN Personal_Information pi ON u.id = pi.user_id
       WHERE b.patient_id = ?
       ORDER BY b.booking_time DESC`,
      [req.user.id]
    );

    res.json({ bookings });
  } catch (error) {
    next(error);
  }
});

app.get('/api/patient/bookings/:bookingId', isAuthenticated, isPatient, async (req, res, next) => {
  try {
    const { bookingId } = req.params;
    
    const booking = await db.queryOne(
      `SELECT b.id, b.booking_time, b.video_room_id, b.status,
              pi.full_name as doctor_name
       FROM Bookings b
       JOIN Users u ON b.doctor_id = u.id
       JOIN Personal_Information pi ON u.id = pi.user_id
       WHERE b.id = ? AND b.patient_id = ?`,
      [bookingId, req.user.id]
    );

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    res.json({ booking });
  } catch (error) {
    next(error);
  }
});

app.get('/api/doctor/bookings', isAuthenticated, isDoctor, async (req, res, next) => {
  try {
    const bookings = await db.query(
      `SELECT b.id, b.booking_time, b.video_room_id, b.status,
              pi.full_name as patient_name
       FROM Bookings b
       JOIN Users u ON b.patient_id = u.id
       JOIN Personal_Information pi ON u.id = pi.user_id
       WHERE b.doctor_id = ?
       ORDER BY b.booking_time DESC`,
      [req.user.id]
    );

    res.json({ bookings });
  } catch (error) {
    next(error);
  }
});

// --- Additional Doctor Routes ---
app.get('/api/doctors', async (req, res, next) => {
  try {
    const doctors = await db.query(
      `SELECT u.id, pi.full_name, u.fayda_id
       FROM Users u
       JOIN Personal_Information pi ON u.id = pi.user_id
       WHERE u.role = 'doctor'
       ORDER BY pi.full_name`
    );

    res.json({ doctors });
  } catch (error) {
    next(error);
  }
});

app.get('/api/doctor/patients', isAuthenticated, isDoctor, async (req, res, next) => {
  try {
    const patients = await db.query(
      `SELECT u.id, pi.full_name, u.fayda_id
       FROM Users u
       JOIN Personal_Information pi ON u.id = pi.user_id
       WHERE u.role = 'patient'
       ORDER BY pi.full_name`
    );

    res.json({ patients });
  } catch (error) {
    next(error);
  }
});

app.get('/api/doctor/patient-records/:patientId', isAuthenticated, isDoctor, async (req, res, next) => {
  try {
    const { patientId } = req.params;
    
    const records = await db.query(
      `SELECT mr.id, mr.record_type, mr.description, mr.is_verified_by_doctor, 
              mr.created_at, pi.full_name as created_by_name
       FROM Medical_Records mr
       LEFT JOIN Users u ON mr.created_by_user_id = u.id
       LEFT JOIN Personal_Information pi ON u.id = pi.user_id
       WHERE mr.patient_id = ?
       ORDER BY mr.created_at DESC`,
      [patientId]
    );

    res.json({ records });
  } catch (error) {
    next(error);
  }
});

app.get('/api/doctor/availability-rules', isAuthenticated, isDoctor, async (req, res, next) => {
  try {
    const rules = await db.query(
      'SELECT day_of_week, start_time, end_time FROM Doctor_Availability_Rules WHERE doctor_id = ? ORDER BY day_of_week',
      [req.user.id]
    );

    res.json({ rules });
  } catch (error) {
    next(error);
  }
});

// --- Doctor Consultation Reports ---
app.post('/api/doctor/consultation-report', isAuthenticated, isDoctor, async (req, res, next) => {
  try {
    const { 
      bookingId, 
      patientId, 
      consultationDate, 
      chiefComplaint, 
      symptoms, 
      diagnosis, 
      treatmentPlan, 
      prescriptions, 
      followUpInstructions, 
      audioTranscript, 
      aiSummary, 
      doctorNotes, 
      vitalSigns 
    } = req.body;

    if (!bookingId || !patientId || !consultationDate) {
      return res.status(400).json({ error: 'Booking ID, patient ID, and consultation date are required' });
    }

    const result = await db.query(
      `INSERT INTO consultation_reports (
        booking_id, patient_id, doctor_id, consultation_date, chief_complaint, 
        symptoms, diagnosis, treatment_plan, prescriptions, follow_up_instructions, 
        audio_transcript, ai_summary, doctor_notes, vital_signs
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        bookingId, patientId, req.user.id, consultationDate, chiefComplaint,
        symptoms, diagnosis, treatmentPlan, prescriptions, followUpInstructions,
        audioTranscript, aiSummary, doctorNotes, JSON.stringify(vitalSigns || {})
      ]
    );

    // Auto-add medical records based on consultation
    if (diagnosis) {
      await db.query(
        'INSERT INTO medical_records (patient_id, record_type, description, created_by_user_id, is_verified_by_doctor) VALUES (?, ?, ?, ?, ?)',
        [patientId, 'condition', diagnosis, req.user.id, true]
      );
    }

    if (prescriptions) {
      await db.query(
        'INSERT INTO medical_records (patient_id, record_type, description, created_by_user_id, is_verified_by_doctor) VALUES (?, ?, ?, ?, ?)',
        [patientId, 'prescription', prescriptions, req.user.id, true]
      );
      
      // Create medication reminder if prescriptions exist
      const medicationNames = prescriptions.split(',').map(p => p.trim());
      for (const medication of medicationNames) {
        if (medication) {
          await db.query(
            'INSERT INTO medication_reminders (patient_id, medication_name, dosage, frequency, prescribed_by) VALUES (?, ?, ?, ?, ?)',
            [patientId, medication, 'As prescribed', 'Daily', req.user.id]
          );
        }
      }
    }

    res.json({
      success: true,
      reportId: result.insertId,
      message: 'Consultation report created successfully'
    });
  } catch (error) {
    next(error);
  }
});

app.get('/api/doctor/consultation-reports', isAuthenticated, isDoctor, async (req, res, next) => {
  try {
    const reports = await db.query(
      `SELECT cr.*, pi.full_name as patient_name
       FROM consultation_reports cr
       JOIN users u ON cr.patient_id = u.id
       JOIN personal_information pi ON u.id = pi.user_id
       WHERE cr.doctor_id = ?
       ORDER BY cr.consultation_date DESC`,
      [req.user.id]
    );

    res.json({ reports });
  } catch (error) {
    next(error);
  }
});

app.put('/api/doctor/consultation-report/:reportId', isAuthenticated, isDoctor, async (req, res, next) => {
  try {
    const { reportId } = req.params;
    const {
      chiefComplaint, symptoms, diagnosis, treatmentPlan, prescriptions,
      followUpInstructions, doctorNotes, vitalSigns, isFinalized
    } = req.body;

    await db.query(
      `UPDATE consultation_reports SET 
       chief_complaint = ?, symptoms = ?, diagnosis = ?, treatment_plan = ?, 
       prescriptions = ?, follow_up_instructions = ?, doctor_notes = ?, 
       vital_signs = ?, is_finalized = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ? AND doctor_id = ?`,
      [
        chiefComplaint, symptoms, diagnosis, treatmentPlan, prescriptions,
        followUpInstructions, doctorNotes, JSON.stringify(vitalSigns || {}),
        isFinalized ? 1 : 0, reportId, req.user.id
      ]
    );

    res.json({
      success: true,
      message: 'Consultation report updated successfully'
    });
  } catch (error) {
    next(error);
  }
});

// --- Hospital Admin Routes ---
app.post('/api/hospital-admin/add-doctor', isAuthenticated, isHospitalAdmin, async (req, res, next) => {
  try {
    const { fayda_id, license_number } = req.body;
    
    if (!fayda_id || !license_number) {
      return res.status(400).json({ error: 'Fayda ID and license number are required' });
    }
    
    // Check if doctor already exists
    const existingUser = await db.queryOne(
      'SELECT id, role, status FROM users WHERE fayda_id = ?',
      [fayda_id]
    );
    
    if (existingUser) {
      return res.status(409).json({ 
        error: 'User with this Fayda ID already exists',
        currentRole: existingUser.role,
        status: existingUser.status
      });
    }
    
    // Fetch user info from Fayda (this would be a real API call in production)
    // For now, we'll create a placeholder entry
    const result = await db.query(
      'INSERT INTO users (fayda_id, role, license_number, hospital_id, status) VALUES (?, ?, ?, ?, ?)',
      [fayda_id, 'doctor', license_number, req.user.hospital_id, 'pending']
    );
    
    res.json({ 
      success: true, 
      doctorId: result.insertId,
      message: 'Doctor added and pending approval' 
    });
  } catch (error) {
    next(error);
  }
});

app.get('/api/hospital-admin/doctors', isAuthenticated, isHospitalAdmin, async (req, res, next) => {
  try {
    const doctors = await db.query(
      `SELECT u.id, u.fayda_id, u.license_number, u.status, u.created_at,
              pi.full_name, pi.date_of_birth, pi.gender
       FROM users u
       LEFT JOIN personal_information pi ON u.id = pi.user_id
       WHERE u.role = 'doctor' AND u.hospital_id = ?
       ORDER BY u.created_at DESC`,
      [req.user.hospital_id]
    );
    
    res.json({ doctors });
  } catch (error) {
    next(error);
  }
});

app.get('/api/hospital-admin/patients', isAuthenticated, isHospitalAdmin, async (req, res, next) => {
  try {
    const patients = await db.query(
      `SELECT u.id, u.fayda_id, pi.full_name, pi.date_of_birth, pi.gender, pi.photo_url,
              COUNT(mr.id) as record_count
       FROM users u
       JOIN personal_information pi ON u.id = pi.user_id
       LEFT JOIN medical_records mr ON u.id = mr.patient_id
       WHERE u.role = 'patient'
       GROUP BY u.id
       ORDER BY pi.full_name`,
      []
    );
    
    res.json({ patients });
  } catch (error) {
    next(error);
  }
});

app.get('/api/hospital-admin/patient/:patientId/records', isAuthenticated, isHospitalAdmin, async (req, res, next) => {
  try {
    const { patientId } = req.params;
    
    // Get patient demographics
    const patient = await db.queryOne(
      `SELECT u.id, u.fayda_id, pi.full_name, pi.date_of_birth, pi.gender, pi.photo_url
       FROM users u
       JOIN personal_information pi ON u.id = pi.user_id
       WHERE u.id = ? AND u.role = 'patient'`,
      [patientId]
    );
    
    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }
    
    // Get medical records
    const records = await db.query(
      `SELECT mr.id, mr.record_type, mr.description, mr.is_verified_by_doctor, 
              mr.created_at, pi.full_name as created_by_name
       FROM medical_records mr
       LEFT JOIN users u ON mr.created_by_user_id = u.id
       LEFT JOIN personal_information pi ON u.id = pi.user_id
       WHERE mr.patient_id = ?
       ORDER BY mr.created_at DESC`,
      [patientId]
    );
    
    res.json({ 
      patient,
      records,
      demographics: patient,
      medicalHistory: records.filter(r => r.record_type === 'condition'),
      medications: records.filter(r => r.record_type === 'prescription'),
      allergies: records.filter(r => r.record_type === 'allergy'),
      notes: records.filter(r => r.record_type === 'note')
    });
  } catch (error) {
    next(error);
  }
});

// --- Super Admin Routes ---
app.post('/api/super-admin/approve-doctor', isAuthenticated, isSuperAdmin, async (req, res, next) => {
  try {
    const { doctorId, approved } = req.body;
    
    if (!doctorId || approved === undefined) {
      return res.status(400).json({ error: 'Doctor ID and approval status are required' });
    }
    
    const status = approved ? 'approved' : 'rejected';
    
    await db.query(
      'UPDATE users SET status = ?, approved_at = CURRENT_TIMESTAMP, approved_by = ? WHERE id = ? AND role = ?',
      [status, req.user.id, doctorId, 'doctor']
    );
    
    res.json({ 
      success: true, 
      message: `Doctor ${approved ? 'approved' : 'rejected'} successfully` 
    });
  } catch (error) {
    next(error);
  }
});

app.get('/api/super-admin/pending-doctors', isAuthenticated, isSuperAdmin, async (req, res, next) => {
  try {
    const doctors = await db.query(
      `SELECT u.id, u.fayda_id, u.license_number, u.status, u.created_at,
              pi.full_name, pi.date_of_birth, pi.gender,
              h.name as hospital_name
       FROM users u
       LEFT JOIN personal_information pi ON u.id = pi.user_id
       LEFT JOIN hospitals h ON u.hospital_id = h.id
       WHERE u.role = 'doctor' AND u.status = 'pending'
       ORDER BY u.created_at DESC`,
      []
    );
    
    res.json({ doctors });
  } catch (error) {
    next(error);
  }
});

app.post('/api/super-admin/add-hospital', isAuthenticated, isSuperAdmin, async (req, res, next) => {
  try {
    const { name, address, phone, email, license_number } = req.body;
    
    if (!name || !license_number) {
      return res.status(400).json({ error: 'Hospital name and license number are required' });
    }
    
    const result = await db.query(
      'INSERT INTO hospitals (name, address, phone, email, license_number, status, approved_by) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [name, address, phone, email, license_number, 'approved', req.user.id]
    );
    
    res.json({ 
      success: true, 
      hospitalId: result.insertId,
      message: 'Hospital added successfully' 
    });
  } catch (error) {
    next(error);
  }
});

app.get('/api/super-admin/hospitals', isAuthenticated, isSuperAdmin, async (req, res, next) => {
  try {
    const hospitals = await db.query(
      `SELECT h.*, 
              COUNT(DISTINCT u.id) as doctor_count,
              pi.full_name as approved_by_name
       FROM hospitals h
       LEFT JOIN users u ON h.id = u.hospital_id AND u.role = 'doctor'
       LEFT JOIN users approver ON h.approved_by = approver.id
       LEFT JOIN personal_information pi ON approver.id = pi.user_id
       GROUP BY h.id
       ORDER BY h.created_at DESC`,
      []
    );
    
    res.json({ hospitals });
  } catch (error) {
    next(error);
  }
});

app.get('/api/super-admin/all-doctors', isAuthenticated, isSuperAdmin, async (req, res, next) => {
  try {
    const doctors = await db.query(
      `SELECT u.id, u.fayda_id, u.license_number, u.status, u.created_at, u.approved_at,
              pi.full_name, pi.date_of_birth, pi.gender,
              h.name as hospital_name,
              approver_pi.full_name as approved_by_name
       FROM users u
       LEFT JOIN personal_information pi ON u.id = pi.user_id
       LEFT JOIN hospitals h ON u.hospital_id = h.id
       LEFT JOIN users approver ON u.approved_by = approver.id
       LEFT JOIN personal_information approver_pi ON approver.id = approver_pi.user_id
       WHERE u.role = 'doctor'
       ORDER BY u.created_at DESC`,
      []
    );
    
    res.json({ doctors });
  } catch (error) {
    next(error);
  }
});

// --- Central Error Handler ---
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);
  res.status(500).json({ error: 'Internal Server Error', message: err.message });
});

// --- Health Check ---
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// --- Server Start ---
const PORT = process.env.PORT || 3001;

const startServer = async () => {
  try {
    await db.testConnection();
    await db.initializeDatabase();
    
    server.listen(PORT, () => {
      console.log(`✅ Backend server is running on http://localhost:${PORT}`);
      console.log(`✅ WebSocket server is running on ws://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer(); 