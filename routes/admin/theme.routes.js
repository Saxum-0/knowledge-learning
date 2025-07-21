const express = require('express');
const router = express.Router();
const { Theme, Cursus } = require('../../models');
const { checkJWT, checkRole } = require('../../middlewares/auth.middleware');
const themeController = require('../../controllers/admin/theme.controller');



router.use(checkJWT, checkRole('admin'));

router.get('/', async (req, res) => {
  try {
    const themes = await Theme.findAll({
      include: { model: Cursus, as: 'cursus' } // si tu as bien mis l'alias dans models/index.js
    });
    res.json(themes);
  } catch (err) {
    console.error('Erreur GET /admin/themes :', err);
    res.status(500).json({ message: 'Erreur lors de la récupération des thèmes' });
  }
});

router.post('/', themeController.createTheme);
router.put('/:id', themeController.updateTheme);
router.delete('/:id', themeController.deleteTheme);

module.exports = router;
