// routes/auth.routes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { checkJWT } = require('../middlewares/auth.middleware');

router.get('/me', checkJWT, authController.getCurrentUser);
router.post('/register', authController.register);
router.get('/verify/:token', authController.verify);
router.post('/login', authController.login);

router.post('/logout', authController.logout);


module.exports = router;
