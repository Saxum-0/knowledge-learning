const express = require('express');
const router = express.Router();
const lessonController = require('../../controllers/admin/lesson.controller');
const { checkJWT, checkRole } = require('../../middlewares/auth.middleware');

// ✅ On importe les bons modèles
const { Lesson, Cursus } = require('../../models');

// 🔐 Middleware global d’admin
router.use(checkJWT, checkRole('admin'));

// 📘 GET : toutes les leçons avec leur cursus associé
router.get('/', async (req, res) => {
  try {
    const lessons = await Lesson.findAll({
      include: { model: Cursus, as: 'cursus', attributes: ['title'] }
    });
    res.json(lessons);
  } catch (err) {
    console.error('Erreur GET /admin/lesson :', err);
    res.status(500).json({ message: 'Erreur récupération leçons' });
  }
});

// POST / PUT / DELETE
router.post('/', lessonController.createLesson);
router.put('/:id', lessonController.updateLesson);
router.delete('/:id', lessonController.deleteLesson);

module.exports = router;
