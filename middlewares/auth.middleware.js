const jwt = require('jsonwebtoken');

exports.checkJWT = (req, res, next) => {
  const token =
    req.cookies?.token || // ← récupère depuis le cookie
    (req.headers.authorization?.startsWith('Bearer ')
      ? req.headers.authorization.split(' ')[1]
      : null);

  if (!token) {
    return res.status(401).json({ message: 'Token manquant ou mal formé.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Token invalide ou expiré.' });
  }
};

exports.checkRole = (role) => {
  return (req, res, next) => {
    if (!req.user || req.user.role !== role) {
      return res.status(403).json({ message: "Accès interdit. Rôle requis : " + role });
    }
    next();
  };
};
