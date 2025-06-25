const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const csrf = require('csurf');
const session = require('express-session');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();

// 📦 Middleware parsing
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 🌐 Fix session behind proxy (ex: Vite dev server)
app.set('trust proxy', 1);

// ✅ CORS configuration
app.use(cors({
  origin: 'http://localhost:5173', // frontend origin
  credentials: true
}));

// 🔐 Session configuration (utilisée par CSRF)
app.use(session({
  secret: process.env.SESSION_SECRET || 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false,           // false en développement
    httpOnly: true,
    sameSite: 'lax'          // recommandé pour CSRF protection
  }
}));

// 🛡️ Middleware CSRF (à utiliser dans les routes concernées)
const csrfProtection = csrf({ cookie: false });

// 🌍 Route de test
app.get('/', (req, res) => {
  res.send('Knowledge Learning API is running 🎓');
});

// 🔗 Routes principales
app.use('/auth', require('./routes/auth.routes'));
app.use('/user', require('./routes/user.routes'));
app.use('/admin', require('./routes/admin.routes'));
app.use('/public', require('./routes/public.routes'));
app.use('/certifications', require('./routes/certification.routes'));


app.use('/validate', require('./routes/validation.routes'));

app.use('/validate-protected', require('./routes/validationProtected.routes'));

app.use('/buy', require('./routes/purchase.routes'));

// 🔐 Route publique pour récupérer le token CSRF
app.use('/security', require('./routes/security.routes'));

// 📦 Routes back-office admin
app.use('/admin/themes', require('./routes/admin/theme.routes'));
app.use('/admin/cursus', require('./routes/admin/cursus.routes'));
app.use('/admin/lesson', require('./routes/admin/lesson.routes'));
app.use('/admin/purchases', require('./routes/admin/purchase.routes'));
app.use('/admin/users', require('./routes/admin/user.routes'));
app.use('/admin/certifications', require('./routes/admin/certification.routes'));
app.use('/admin/validated-lessons', require('./routes/admin/validatedLesson.routes'));

module.exports = app;
