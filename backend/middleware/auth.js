import db from '../db.js';

// Middleware to check if user is authenticated
export const isAuthenticated = async (req, res, next) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({ 
        error: 'Unauthorized', 
        message: 'Authentication required' 
      });
    }

    // Verify user exists in database
    const user = await db.queryOne(
      'SELECT id, fayda_id, role FROM Users WHERE id = ?',
      [req.session.userId]
    );

    if (!user) {
      req.session.destroy();
      return res.status(401).json({ 
        error: 'Unauthorized', 
        message: 'User not found' 
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Authentication middleware error:', error);
    return res.status(500).json({ 
      error: 'Internal Server Error',
      message: 'Authentication check failed' 
    });
  }
};

// Middleware to check if user has specific role
export const isRole = (requiredRole) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ 
          error: 'Unauthorized', 
          message: 'Authentication required' 
        });
      }

      if (req.user.role !== requiredRole) {
        return res.status(403).json({ 
          error: 'Forbidden', 
          message: `Access denied. Required role: ${requiredRole}` 
        });
      }

      next();
    } catch (error) {
      console.error('Role check middleware error:', error);
      return res.status(500).json({ 
        error: 'Internal Server Error',
        message: 'Role verification failed' 
      });
    }
  };
};

// Middleware to check if user is a patient
export const isPatient = isRole('patient');

// Middleware to check if user is a doctor
export const isDoctor = isRole('doctor');

// Middleware to check if user is a hospital admin
export const isHospitalAdmin = isRole('hospital_admin');

// Middleware to check if user is a super admin
export const isSuperAdmin = isRole('super_admin');

// Middleware to check if user has admin privileges (hospital_admin or super_admin)
export const isAdmin = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ 
        error: 'Unauthorized', 
        message: 'Authentication required' 
      });
    }

    if (!['hospital_admin', 'super_admin'].includes(req.user.role)) {
      return res.status(403).json({ 
        error: 'Forbidden', 
        message: 'Admin access required' 
      });
    }

    next();
  } catch (error) {
    console.error('Admin check middleware error:', error);
    return res.status(500).json({ 
      error: 'Internal Server Error',
      message: 'Admin verification failed' 
    });
  }
};

// Optional authentication middleware (doesn't fail if not authenticated)
export const optionalAuth = async (req, res, next) => {
  try {
    if (req.session.userId) {
      const user = await db.queryOne(
        'SELECT id, fayda_id, role FROM Users WHERE id = ?',
        [req.session.userId]
      );
      
      if (user) {
        req.user = user;
      }
    }
    next();
  } catch (error) {
    console.error('Optional auth middleware error:', error);
    next(); // Continue even if there's an error
  }
}; 