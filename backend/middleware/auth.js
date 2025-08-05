import jwt from 'jsonwebtoken';
import { executeQuery } from '../database/connection.js';

// JWT Secret from environment
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Generate JWT token
export const generateToken = (user) => {
  const payload = {
    id: user.id,
    role: user.role,
    email: user.email,
    fayda_id: user.fayda_id
  };
  
  return jwt.sign(payload, JWT_SECRET, { 
    expiresIn: process.env.JWT_EXPIRES_IN || '24h' 
  });
};

// Verify JWT token
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid token');
  }
};

// Authentication middleware
export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ 
        error: 'Access token required',
        message: 'Please provide a valid authentication token' 
      });
    }

    const decoded = verifyToken(token);
    
    // Get user from database to ensure they still exist and are active
    const user = await executeQuery(
      'SELECT id, role, email, full_name, is_active, is_verified FROM users WHERE id = ?',
      [decoded.id]
    );

    if (!user || user.length === 0) {
      return res.status(401).json({ 
        error: 'User not found',
        message: 'User account does not exist' 
      });
    }

    if (!user[0].is_active) {
      return res.status(401).json({ 
        error: 'Account deactivated',
        message: 'Your account has been deactivated' 
      });
    }

    req.user = user[0];
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).json({ 
      error: 'Invalid token',
      message: 'Authentication failed' 
    });
  }
};

// Role-based authorization middleware
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        error: 'Authentication required',
        message: 'Please login to access this resource' 
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: 'Access denied',
        message: 'You do not have permission to access this resource' 
      });
    }

    next();
  };
};

// Super Admin authorization
export const requireSuperAdmin = authorizeRoles('super_admin');

// Hospital Admin authorization
export const requireHospitalAdmin = authorizeRoles('hospital_admin');

// Doctor authorization
export const requireDoctor = authorizeRoles('doctor');

// Patient authorization
export const requirePatient = authorizeRoles('patient');

// Hospital Admin or Doctor authorization
export const requireHospitalStaff = authorizeRoles('hospital_admin', 'doctor');

// All authenticated users
export const requireAuth = authorizeRoles('super_admin', 'hospital_admin', 'doctor', 'patient');

// Optional authentication (for public routes that can work with or without auth)
export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const decoded = verifyToken(token);
      const user = await executeQuery(
        'SELECT id, role, email, full_name, is_active FROM users WHERE id = ?',
        [decoded.id]
      );

      if (user && user.length > 0 && user[0].is_active) {
        req.user = user[0];
      }
    }
    next();
  } catch (error) {
    // Continue without authentication
    next();
  }
};

// Rate limiting middleware
export const rateLimiter = (windowMs = 15 * 60 * 1000, max = 100) => {
  const requests = new Map();

  return (req, res, next) => {
    const ip = req.ip || req.connection.remoteAddress;
    const now = Date.now();
    const windowStart = now - windowMs;

    // Clean old entries
    if (requests.has(ip)) {
      requests.set(ip, requests.get(ip).filter(timestamp => timestamp > windowStart));
    } else {
      requests.set(ip, []);
    }

    const userRequests = requests.get(ip);
    
    if (userRequests.length >= max) {
      return res.status(429).json({
        error: 'Too many requests',
        message: 'Rate limit exceeded. Please try again later.'
      });
    }

    userRequests.push(now);
    next();
  };
};

// Logging middleware
export const logRequest = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.originalUrl} - ${res.statusCode} - ${duration}ms`);
  });
  
  next();
}; 