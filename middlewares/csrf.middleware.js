const csrf = require('csurf');
const csrfProtection = csrf({ cookie: false }); // on utilise la session


module.exports = csrfProtection;
