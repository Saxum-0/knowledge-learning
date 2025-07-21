const express = require('express');
const router = express.Router();
const { checkJWT } = require('../middlewares/auth.middleware');
const userController = require('../controllers/user.controller');

router.get('/me', checkJWT, userController.getProfile);
router.put('/me', checkJWT, userController.updateProfile);
router.get('/certifications', checkJWT, userController.getCertifications);


module.exports = router;
