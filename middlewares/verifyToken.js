const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
  const authToken = req.headers.authorization
  if (authToken) {
    const token = authToken.split(" ")[1];
    try {
      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      req.user = decoded;
      next();
    } catch (error) {
      return res.status(401).json({message:"invalid token ,access denied"})
    }
  } else {
    res.status(401).json({message:"no token provied ,access denied"})
  }
}
// verify token and admin 
function verifyAdmin(req, res, next) { 
  verifyToken(req, res, () => {
    if (!req.body.isAdmin) {
      next();
    } else {
      return res.status(403).json({message:"not allowed , only admin"})
    }
  })
}

// verify token and User 
function verifyUser(req, res, next) { 
  verifyToken(req, res, () => {
    if (req.user.id === req.params.id) {
      next();
    } else {
      return res.status(403).json({message:"not allowed , only user"})
    }
  })
}
// verify token and Authorazition 
function verifyAuthorazition(req, res, next) { 
  verifyToken(req, res, () => {
    if (req.user.id === req.params.id || req.user.isAdmin) {
      next();
    } else {
      return res.status(403).json({message:"not allowed , only user and admin"})
    }
  })
}
module.exports = {
  verifyToken,
  verifyAdmin,
  verifyUser,
  verifyAuthorazition
}