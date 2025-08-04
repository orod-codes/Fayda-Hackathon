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
import OpenAI from 'openai';
import db from './db.js';

const app = express();


// --- Initialize OpenAI Client ---
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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

// --- Authentication Routes ---
app.get('/api/auth/login', (req, res) => {
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

app.post('/api/auth/token', async (req, res, next) => {
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
    req.session.user = userInfo;

    if (!db.users[userInfo.sub]) {
        db.users[userInfo.sub] = { role: 'patient', allergies: [], prescriptions: [], consultations: [], personalData: { ...userInfo } };
    }

    res.json({ success: true, user: userInfo });
  } catch (error) {
    next(error);
  }
});

// --- Health Check and General Endpoints ---
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: db.metadata.version,
    environment: process.env.NODE_ENV || 'development'
  });
});

app.get('/api/auth/session', (req, res) => {
  if (req.session.user) {
    res.json({ 
      authenticated: true, 
      user: {
        id: req.session.user.sub,
        role: db.users[req.session.user.sub]?.role || 'patient',
        ...req.session.user
      }
    });
  } else {
    res.json({ authenticated: false });
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


// --- AI & Patient Endpoints ---
const authMiddleware = (req, res, next) => {
  if (!req.session.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
};

app.post('/api/patient/ask', authMiddleware, async (req, res, next) => {
  try {
    const { question } = req.body;
    if (!question) {
      return res.status(400).json({ error: 'Question is required.' });
    }

    const patient = db.users[req.session.user.sub];
    if (!patient) {
      return res.status(404).json({ error: 'Patient data not found.' });
    }

    const patientContext = `
      Patient Information:
      - Allergies: ${patient.allergies.length ? patient.allergies.join(', ') : 'None recorded'}.
      - Prescriptions: ${patient.prescriptions.length ? patient.prescriptions.map(p => `${p.medication} (${p.dosage})`).join('; ') : 'None recorded'}.
      - Recent Consultations: ${patient.consultations.length ? patient.consultations.map(c => `${c.diagnosis} on ${new Date(c.consultedAt).toLocaleDateString()}`).join('; ') : 'None recorded'}.
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are Hakim AI, a helpful and secure medical AI assistant. Your role is to answer patient questions based *only* on the medical information provided to you. Do not invent or infer any information. Do not provide any medical advice. If the user asks something you cannot answer from the provided data, politely state that you do not have that information. Frame your answers clearly and simply.`
        },
        {
          role: "user",
          content: `Patient's Data:\n${patientContext}\n\nPatient's Question: "${question}"`
        }
      ],
      temperature: 0.2,
      max_tokens: 200,
    });

    const answer = completion.choices[0].message.content;
    res.json({ answer });

  } catch (error) {
    console.error('OpenAI API Error:', error);
    next(error);
  }
});

app.post('/api/patient/allergy', authMiddleware, (req, res) => {
    const { allergy } = req.body;
    if (!allergy) return res.status(400).json({ error: 'Allergy is required' });
    const patientId = req.session.user.sub;
    if (!db.users[patientId]) db.users[patientId] = { role: 'patient', allergies: [], prescriptions: [] };
    db.users[patientId].allergies.push(allergy);
    res.status(201).json({ message: 'Allergy added successfully.', allergies: db.users[patientId].allergies });
});

// --- Healthcare Professional Endpoints ---
app.get('/api/professional/patients', authMiddleware, (req, res) => {
  try {
    const patients = [];
    for (const [patientId, patientData] of Object.entries(db.users)) {
      if (patientData.role === 'patient') {
        patients.push({
          id: patientId,
          ...patientData
        });
      }
    }
    res.json({ patients });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch patients' });
  }
});

app.get('/api/professional/patient/:patientId', authMiddleware, (req, res) => {
  try {
    const { patientId } = req.params;
    const patient = db.users[patientId];
    if (!patient || patient.role !== 'patient') {
      return res.status(404).json({ error: 'Patient not found' });
    }
    res.json({ patient });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch patient details' });
  }
});

app.post('/api/professional/prescription', authMiddleware, (req, res) => {
  try {
    const { patientId, prescription, medication, dosage, instructions } = req.body;
    const professionalId = req.session.user.sub;
    
    if (!patientId || !prescription) {
      return res.status(400).json({ error: 'Patient ID and prescription are required' });
    }
    
    if (!db.users[patientId]) {
      db.users[patientId] = { role: 'patient', allergies: [], prescriptions: [] };
    }
    
    const prescriptionRecord = {
      id: Date.now().toString(),
      prescription,
      medication: medication || prescription,
      dosage: dosage || 'As directed',
      instructions: instructions || 'Take as prescribed',
      prescribedBy: professionalId,
      prescribedAt: new Date().toISOString(),
      status: 'active'
    };
    
    db.users[patientId].prescriptions.push(prescriptionRecord);
    
    res.status(201).json({ 
      message: 'Prescription added successfully for patient ' + patientId,
      prescription: prescriptionRecord
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add prescription' });
  }
});

app.post('/api/professional/consultation', authMiddleware, (req, res) => {
  try {
    const { patientId, diagnosis, notes, type = 'general' } = req.body;
    const professionalId = req.session.user.sub;
    
    if (!patientId || !diagnosis) {
      return res.status(400).json({ error: 'Patient ID and diagnosis are required' });
    }
    
    if (!db.users[patientId]) {
      db.users[patientId] = { role: 'patient', allergies: [], prescriptions: [], consultations: [] };
    }
    
    if (!db.users[patientId].consultations) {
      db.users[patientId].consultations = [];
    }
    
    const consultationRecord = {
      id: Date.now().toString(),
      type,
      diagnosis,
      notes: notes || '',
      consultedBy: professionalId,
      consultedAt: new Date().toISOString(),
      status: 'completed'
    };
    
    db.users[patientId].consultations.push(consultationRecord);
    
    res.status(201).json({ 
      message: 'Consultation recorded successfully',
      consultation: consultationRecord
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to record consultation' });
  }
});

app.get('/api/professional/stats', authMiddleware, (req, res) => {
  try {
    const totalPatients = Object.values(db.users).filter(user => user.role === 'patient').length;
    const stats = {
      totalPatients,
      consultationsToday: Math.floor(Math.random() * 10) + 1,
      emergencyCases: Math.floor(Math.random() * 3),
      pendingReports: Math.floor(Math.random() * 5) + 1,
      averageRating: (4.5 + Math.random() * 0.5).toFixed(1),
      yearsExperience: Math.floor(Math.random() * 15) + 5
    };
    res.json({ stats });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});


// --- Central Error Handler ---
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);
  res.status(500).json({ error: 'Internal Server Error', message: err.message });
});

// --- Server Start ---
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Backend server is running on http://localhost:${PORT}`);
  console.log(`Health check available at http://localhost:${PORT}/api/health`);
});

