const express = require('express');
const router = express.Router();
const { Purchase, User, Lesson, Cursus } = require('../../models');
const { checkJWT, checkRole } = require('../../middlewares/auth.middleware');
const controller = require('../../controllers/admin/purchase.controller');

router.use(checkJWT, checkRole('admin'));

router.get('/', controller.getAllPurchases);
router.delete('/:id', controller.deletePurchase);

module.exports = router;
