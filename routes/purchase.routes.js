// routes/purchase.routes.js
const express = require('express');
const router = express.Router();
const { checkJWT } = require('../middlewares/auth.middleware');
const csrfProtection = require('../middlewares/csrf.middleware');
const purchaseController = require('../controllers/purchase.controller');


router.post('/lesson/:id',
  (req, res, next) => {
    console.log('POST session ID:', req.sessionID);
    console.log('Cookies:', req.headers.cookie);
    next();
  },
  checkJWT,
  csrfProtection,
  purchaseController.buyLesson
);


  checkJWT,
  csrfProtection,
  purchaseController.buyLesson


router.post('/cursus/:id', checkJWT, csrfProtection, purchaseController.buyCursus);
router.get('/my-lessons', checkJWT, csrfProtection, purchaseController.getMyLessons);
router.get('/my-cursus', checkJWT, csrfProtection, purchaseController.getMyCursus);

module.exports = router;
