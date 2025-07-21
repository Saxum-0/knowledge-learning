const jwt = require('jsonwebtoken');

// middlewares/auth.middleware.js

// middlewares/auth.middleware.js

if (process.env.NODE_ENV === 'test') {
  // En mode test, checkJWT est une fonction no-op
  module.exports.checkJWT = (req, res, next) => next();
} else {
  const jwt = require('jsonwebtoken');

  module.exports.checkJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) return res.status(403).json({ error: 'Token manquant' });

    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      next();
    } catch (err) {
      res.status(403).json({ error: 'Token invalide' });
    }
  };
}


exports.checkJWT = (req, res, next) => {
  const token = 
  req.cookies?.token || req.headers?.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token manquant dans le cookie.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Token invalide ou expiré.' });
  }
};

// 🔐 Middleware de vérification du rôle (admin, etc.)
exports.checkRole = (role) => {
  return (req, res, next) => {
    if (!req.user || req.user.role !== role) {
      return res.status(403).json({ message: `Accès interdit. Rôle requis : ${role}` });
    }
    next();
  };
};
