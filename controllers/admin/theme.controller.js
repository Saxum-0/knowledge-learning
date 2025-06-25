const Theme = require('../../models/theme.model');

// GET tous les thèmes
exports.getAllThemes = async (req, res) => {
  try {
    const themes = await Theme.findAll();
    res.json(themes);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

// POST créer un thème
exports.createTheme = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: "Nom requis" });

    const theme = await Theme.create({ name });
    res.status(201).json(theme);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

// PUT modifier un thème
exports.updateTheme = async (req, res) => {
  try {
    const theme = await Theme.findByPk(req.params.id);
    if (!theme) return res.status(404).json({ message: "Thème non trouvé." });

    theme.name = req.body.name || theme.name;
    await theme.save();
    res.json(theme);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

// DELETE supprimer un thème
exports.deleteTheme = async (req, res) => {
  try {
    const theme = await Theme.findByPk(req.params.id);
    if (!theme) return res.status(404).json({ message: "Thème non trouvé." });

    await theme.destroy();
    res.json({ message: "Thème supprimé." });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};
