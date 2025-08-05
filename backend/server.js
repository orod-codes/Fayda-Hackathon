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
import { testConnection } from './database/connection.js';
import { logRequest } from './middleware/auth.js';

// Import routes
import authRoutes from './routes/auth.js';
import superAdminRoutes from './routes/super-admin.js';
import hospitalAdminRoutes from './routes/hospital-admin.js';
import doctorRoutes from './routes/doctor.js';
import patientRoutes from './routes/patient.js';

const app = express();

// --- Initialize OpenAI Client ---
let openai = null;
if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

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

// Apply logging middleware
app.use(logRequest);

// --- Health Check ---
app.get('/health', async (req, res) => {
  try {
    const dbStatus = await testConnection();
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: dbStatus ? 'connected' : 'disconnected',
      version: '1.0.0'
    });
  } catch (error) {
    res.status(500).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error.message
    });
  }
});

// --- API Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/super-admin', superAdminRoutes);
app.use('/api/hospital-admin', hospitalAdminRoutes);
app.use('/api/doctor', doctorRoutes);
app.use('/api/patient', patientRoutes);

// --- Fayda Integration Routes (Existing) ---

// Helper Functions
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

// Authentication Routes
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
  authUrl.searchParams.append('display', 'page');
  authUrl.searchParams.append('nonce', uuidv4());
  authUrl.searchParams.append('ui_locales', 'en');

  res.json({ authUrl: authUrl.toString() });
});

app.get('/api/auth/callback', async (req, res) => {
  const { code, state } = req.query;

  if (!code || !state) {
    return res.status(400).json({ error: 'Missing code or state parameter' });
  }

  if (state !== req.session.state) {
    return res.status(400).json({ error: 'Invalid state parameter' });
  }

  try {
    const clientAssertion = generateClientAssertion();
    const tokenResponse = await fetch(process.env.TOKEN_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: process.env.CLIENT_ID,
        client_assertion_type: 'urn:ietf:params:oauth:client-assertion-type:jwt-bearer',
        client_assertion: clientAssertion,
        code: code,
        redirect_uri: process.env.REDIRECT_URI,
        code_verifier: req.session.codeVerifier,
      }),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok) {
      console.error('Token exchange failed:', tokenData);
      return res.status(400).json({ error: 'Token exchange failed' });
    }

    const userInfoResponse = await fetch(process.env.USERINFO_ENDPOINT, {
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`,
      },
    });

    const userInfo = await userInfoResponse.json();

    if (!userInfoResponse.ok) {
      console.error('User info fetch failed:', userInfo);
      return res.status(400).json({ error: 'Failed to fetch user info' });
    }

    res.json({
      accessToken: tokenData.access_token,
      user: userInfo
    });

  } catch (error) {
    console.error('Callback error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// --- Chat Routes ---
app.post('/api/chat', async (req, res) => {
  try {
    const { message, userId, userRole } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Check if OpenAI is available
    if (!openai) {
      return res.status(503).json({
        error: 'Chat service unavailable',
        message: 'AI chat feature is not configured. Please set OPENAI_API_KEY environment variable.'
      });
    }

    const systemPrompt = `You are Hakim AI, a medical assistant. You help patients, doctors, and hospital administrators with healthcare-related questions. 
    
    Current user role: ${userRole || 'patient'}
    User ID: ${userId || 'unknown'}
    
    Please provide helpful, accurate, and safe medical information. Always remind users to consult with healthcare professionals for serious medical concerns.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message }
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    const response = completion.choices[0].message.content;

    res.json({
      message: response,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({
      error: 'Failed to process chat message',
      message: 'An error occurred while processing your message'
    });
  }
});

// --- Error Handling Middleware ---
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'production' 
      ? 'Something went wrong' 
      : err.message
  });
});

// --- 404 Handler ---
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    message: `The requested route ${req.originalUrl} does not exist`
  });
});

// --- Server Startup ---
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Test database connection
    const dbConnected = await testConnection();
    if (!dbConnected) {
      console.error('❌ Failed to connect to database. Server will start but some features may not work.');
    }

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📊 Health check available at http://localhost:${PORT}/health`);
      console.log(`🔗 API documentation available at http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;

