const express = require('express');
const router = express.Router();
const csrfProtection = require('../middlewares/csrf.middleware');
const { checkJWT } = require('../middlewares/auth.middleware');
const validationController = require('../controllers/validation.controller');

router.use(checkJWT)

router.post('/lesson/:id', checkJWT, csrfProtection, validationController.validateLesson);
router.post('/cursus/:id', checkJWT, csrfProtection, validationController.validateCursus);
router.delete('/lesson/:id', checkJWT, csrfProtection, validationController.unvalidateLesson);
router.delete('/cursus/:id', checkJWT, csrfProtection, validationController.unvalidateCursus);

module.exports = router;