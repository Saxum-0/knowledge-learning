const express = require('express');
const router = express.Router();
const csrf = require('csurf');

// Ce csrfProtection ici est important !
const csrfProtection = csrf({ cookie: false });

router.get('/csrf-token', csrfProtection, (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

module.exports = router;


