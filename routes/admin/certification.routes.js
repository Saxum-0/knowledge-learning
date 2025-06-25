const express = require('express');
const router = express.Router();
const { checkJWT, checkRole } = require('../../middlewares/auth.middleware');
const controller = require('../../controllers/admin/certification.controller');

router.use(checkJWT, checkRole('admin'));

router.get('/', controller.getAllCertifications);
router.delete('/:id', controller.deleteCertification);

module.exports = router;
