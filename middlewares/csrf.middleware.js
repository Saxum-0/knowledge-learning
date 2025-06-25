const csrf = require('csurf');

module.exports = csrf({
  cookie: false,
  value: req => req.headers['x-csrf-token'] // ← lecture dans les headers
});
