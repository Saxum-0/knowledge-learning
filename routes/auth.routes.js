// routes/auth.routes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

router.post('/register', authController.register);
router.get('/verify/:token', authController.verify);
router.post('/login', authController.login);

router.post('/logout', authController.logout);


module.exports = router;
