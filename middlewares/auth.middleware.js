const jwt = require('jsonwebtoken');

exports.checkJWT = (req, res, next) => {
  const token = req.cookies?.token;

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
