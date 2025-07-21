const express = require('express');
const router = express.Router();
const { checkJWT, checkRole } = require('../../middlewares/auth.middleware');
const controller = require('../../controllers/admin/validatedLesson.controller');

router.use(checkJWT, checkRole('admin'));

router.get('/', controller.getAllValidatedLessons);
router.delete('/:userId/:lessonId', controller.deleteValidatedLesson);

module.exports = router;