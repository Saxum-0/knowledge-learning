const express = require('express');
const router = express.Router();
const { checkJWT } = require('../middlewares/auth.middleware');
const validationController = require('../controllers/validation.controller');

router.use(checkJWT)

router.get('/my-validations', checkJWT, validationController.getMyValidations)

module.exports = router;
