const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
  const authToken = req.headers.authorization;
  // console.log(authToken);
  if (authToken) {
    const token = authToken.split(" ")[1];
    // console.log(token);
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      next();
    } catch (error) {
      return res.status(401).json({ message: "Invalid token, access denied" });
    }
  } else {
    res.status(401).json({ message: "No token provided, access denied" });
  }
}

function verifyAdmin(req, res, next) {
  verifyToken(req, res, () => {
    if (req.user.isAdmin) {
      next();
    } else {
      return res.status(403).json({ message: "Not allowed, only admin" });
    }
  });
}

function verifyUser(req, res, next) {
  verifyToken(req, res, () => {
    if (req.user.id === req.params.id) {
      next();
    } else {
      return res.status(403).json({ message: "Not allowed, only the user" });
    }
  });
}

function verifyAuthorization(req, res, next) {
  verifyToken(req, res, () => {
    if (req.user.id === req.params.id || req.user.isAdmin) {
      next();
    } else {
      return res.status(403).json({ message: "Not allowed, only user or admin" });
    }
  });
}

module.exports = {
  verifyToken,
  verifyAdmin,
  verifyUser,
  verifyAuthorization, 
};
