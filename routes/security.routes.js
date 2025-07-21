const express = require('express');
const router = express.Router();
const csrf = require('csurf');

// ❗ Important : crée le middleware CSRF ici
const csrfProtection = csrf({ cookie: false }); // ou `{ sessionKey: 'session' }` si tu utilises express-session

router.get('/csrf-token', csrfProtection, (req, res) => {
  const token = req.csrfToken();
  res.json({ csrfToken: token });
});

module.exports = router;


