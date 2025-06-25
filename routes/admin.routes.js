const express = require('express');
const router = express.Router();
const { checkJWT, checkRole } = require('../middlewares/auth.middleware');

router.get('/dashboard', checkJWT, checkRole('admin'), (req, res) => {
  res.json({ message: "Bienvenue dans le back-office admin !" });
});

module.exports = router;
