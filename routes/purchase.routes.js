const express = require('express');
const router = express.Router();
const { checkJWT } = require('../middlewares/auth.middleware');
const purchaseController = require('../controllers/purchase.controller');
const csrfProtection = require('../middlewares/csrf.middleware');

// Achat d'une leçon
router.post('/lesson/:id', checkJWT, csrfProtection, purchaseController.buyLesson);
router.post('/cursus/:id', checkJWT, csrfProtection, purchaseController.buyCursus);

router.get('/my-lessons', checkJWT, csrfProtection, purchaseController.getMyLessons);
router.get('/my-cursus', checkJWT, csrfProtection, purchaseController.getMyCursus);

module.exports = router;