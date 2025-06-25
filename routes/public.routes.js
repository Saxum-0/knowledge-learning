const express = require('express');
const router = express.Router();

const { Theme, Cursus, Lesson } = require('../models'); // ← utilise le fichier index.js qui gère les associations
const { checkJWT } = require('../middlewares/auth.middleware');


// ✅ Tous les thèmes avec leurs cursus
router.get('/themes', async (req, res) => {
  try {
    const themes = await Theme.findAll({
      include: {
        model: Cursus,
        as: 'cursus' // ← alias défini dans index.js
      }
    });
    res.json(themes);
  } catch (err) {
    console.error('❌ Erreur /themes :', err.message);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// ✅ Tous les cursus d’un thème avec leurs leçons
router.get('/themes/:themeId/cursus', async (req, res) => {
  try {
    const { themeId } = req.params;
    const cursus = await Cursus.findAll({
      where: { ThemeId: themeId },
      include: {
        model: Lesson,
        as: 'lessons' // ← alias défini dans index.js
      }
    });
    res.json(cursus);
  } catch (err) {
    console.error('❌ Erreur /themes/:themeId/cursus :', err.message);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// ✅ Toutes les leçons d’un cursus
router.get('/cursus/:cursusId/lessons', async (req, res) => {
  try {
    const { cursusId } = req.params;
    const lessons = await Lesson.findAll({
      where: { CursusId: cursusId }
    });
    res.json(lessons);
  } catch (err) {
    console.error('❌ Erreur /cursus/:cursusId/lessons :', err.message);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});


module.exports = router;
