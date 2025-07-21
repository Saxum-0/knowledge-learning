const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const csrf = require('csurf');
const session = require('express-session');
const cookieParser = require('cookie-parser');
// Loads environment variables.
require('dotenv').config();

const app = express();

// Parses incoming cookies and request bodies.
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));



// CORS configuration
app.use(cors({
  origin: ['https://knowledge-learning.netlify.app', 'http://localhost:5173'],
  credentials: true
}))

app.set('trust proxy', 1);

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: true, //false in local
    sameSite: 'none',
    httpOnly: true
  }
}))





// 🛡️ Middleware CSRF (à utiliser dans les routes concernées)
const csrfProtection = csrf({ cookie: true });

// 🌍 Route de test
app.get('/', (req, res) => {
  res.send('Knowledge Learning API is running 🎓');
});

// main Routes
app.use('/auth', require('./routes/auth.routes'));
app.use('/user', require('./routes/user.routes'));
app.use('/admin', require('./routes/admin.routes'));
app.use('/public', require('./routes/public.routes'));
app.use('/certifications', require('./routes/certification.routes'));


app.use('/validate', require('./routes/validation.routes'));

app.use('/validate-protected', require('./routes/validationProtected.routes'));

app.use('/buy', require('./routes/purchase.routes'));

//  Routes CSRF
app.use('/security', require('./routes/security.routes'));


// Routes Stripe
app.use('/stripe', require('./routes/stripe.routes'));


// Routes back-office admin
app.use('/admin/themes', require('./routes/admin/theme.routes'));
app.use('/admin/cursus', require('./routes/admin/cursus.routes'));
app.use('/admin/lesson', require('./routes/admin/lesson.routes'));
app.use('/admin/purchases', require('./routes/admin/purchase.routes'));
app.use('/admin/users', require('./routes/admin/user.routes'));
app.use('/admin/certifications', require('./routes/admin/certification.routes'));
app.use('/admin/validated-lessons', require('./routes/admin/validatedLesson.routes'));



module.exports = app;
