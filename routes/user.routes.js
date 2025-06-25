const express = require('express');
const router = express.Router();
const { checkJWT } = require('../middlewares/auth.middleware');
const userController = require('../controllers/user.controller');

router.get('/me', checkJWT, userController.getProfile);
router.get('/me', checkJWT, (req, res) => {
  res.json({
    message: 'Bienvenue utilisateur authentifié !',
    user: req.user
  });
});
router.put('/me', checkJWT, userController.updateProfile);
router.get('/certifications', checkJWT, userController.getCertifications);


module.exports = router;
