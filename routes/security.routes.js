const express = require('express');
const router = express.Router();
const csrf = require('csurf');

// middleware CSRF
const csrfProtection = csrf({ cookie: false }); 

router.get('/csrf-token', csrfProtection, (req, res) => {
  const token = req.csrfToken();
  res.json({ csrfToken: token });
});

module.exports = router;


