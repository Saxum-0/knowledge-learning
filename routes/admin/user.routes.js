const express = require('express');
const router = express.Router();
const { checkJWT, checkRole } = require('../../middlewares/auth.middleware');
const controller = require('../../controllers/admin/user.controller');

router.use(checkJWT, checkRole('admin'));

router.get('/', controller.getAllUsers);
router.get('/:id', controller.getUserById);
router.put('/:id', controller.updateUser);
router.delete('/:id', controller.deleteUser);

module.exports = router;
