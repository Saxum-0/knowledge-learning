const { Cursus, Theme } = require('../../models');

exports.getAll = async (req, res) => {
  try {
    const cursus = await Cursus.findAll({
      include: [
        {
          model: Theme,
          as: 'theme', // 🔥 très important de mettre le bon alias
          attributes: ['name']
        }
      ]
    });
    res.json(cursus);
  } catch (err) {
    console.error('Erreur récupération cursus:', err);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};


// POST
// Exemple contrôleur POST
exports.create = async (req, res) => {
  try {
    const { title, price, ThemeId } = req.body;
    const newCursus = await Cursus.create({ title, price, ThemeId });
    res.status(201).json(newCursus);
  } catch (err) {
    console.error('Erreur création cursus :', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};


// PUT
exports.update = async (req, res) => {
  const { title, price, themeId } = req.body;
  try {
    const cursus = await Cursus.findByPk(req.params.id);
    if (!cursus) return res.status(404).json({ message: "Cursus introuvable." });

    cursus.title = title ?? cursus.title;
    cursus.price = price ?? cursus.price;
    cursus.ThemeId = themeId ?? cursus.ThemeId;

    await cursus.save();
    res.json(cursus);
  } catch (err) {
    res.status(500).json({ message: "Erreur mise à jour." });
  }
};

// DELETE
exports.delete = async (req, res) => {
  try {
    const cursus = await Cursus.findByPk(req.params.id);
    if (!cursus) return res.status(404).json({ message: "Cursus introuvable." });

    await cursus.destroy();
    res.json({ message: "Cursus supprimé." });
  } catch (err) {
    res.status(500).json({ message: "Erreur suppression." });
  }
};
