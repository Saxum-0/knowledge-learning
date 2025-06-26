// routes/security.routes.js
const express = require('express');
const router = express.Router();
const csrfProtection = require('../middlewares/csrf.middleware');

// Route publique pour obtenir le token CSRF
router.get('/csrf-token', csrfProtection, (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});




module.exports = router;


