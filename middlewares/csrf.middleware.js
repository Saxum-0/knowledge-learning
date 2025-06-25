// middlewares/csrf.middleware.js
const csrf = require('csurf');

// Utilise la session, pas les cookies
const csrfProtection = csrf({ cookie: false });

module.exports = csrfProtection;
