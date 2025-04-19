const jwt = require("jsonwebtoken");

/**
 * @desc Verify JWT token middleware
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ 
      success: false,
      message: "No valid token provided, access denied" 
    });
  }

  const token = authHeader.split(' ')[1];
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Token verification error:', error.message);
    
    let errorMessage = "Invalid token, access denied";
    if (error.name === 'TokenExpiredError') {
      errorMessage = "Token expired, please log in again";
    } else if (error.name === 'JsonWebTokenError') {
      errorMessage = "Malformed token, access denied";
    }

    return res.status(401).json({ 
      success: false,
      message: errorMessage 
    });
  }
}

/**
 * @desc Verify admin role middleware
 */
function verifyAdmin(req, res, next) {
  verifyToken(req, res, () => {
    if (!req.user?.isAdmin) {
      return res.status(403).json({ 
        success: false,
        message: "Forbidden: Admin privileges required" 
      });
    }
    next();
  });
}

/**
 * @desc Verify user ownership middleware
 */
function verifyUser(req, res, next) {
  verifyToken(req, res, () => {
    if (req.user.id !== req.params.id) {
      return res.status(403).json({ 
        success: false,
        message: "Forbidden: You can only access your own data" 
      });
    }
    next();
  });
}

/**
 * @desc Flexible authorization (user or admin)
 */
function verifyAuthorization(req, res, next) {
  verifyToken(req, res, () => {
    if (req.user.id === req.params.id || req.user.isAdmin) {
      return next();
    }
    return res.status(403).json({ 
      success: false,
      message: "Forbidden: Not authorized to perform this action" 
    });
  });
}

module.exports = {
  verifyToken,
  verifyAdmin,
  verifyUser,
  verifyAuthorization
};