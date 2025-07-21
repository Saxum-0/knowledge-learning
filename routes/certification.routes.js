const express = require('express');
const router = express.Router();
const { checkJWT } = require('../middlewares/auth.middleware');
const certificationController = require('../controllers/certification.controller');

router.get('/my-certifications', checkJWT, certificationController.getMyCertifications);

module.exports = router;
