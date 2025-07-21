const { Purchase, User, Lesson, Cursus } = require('../../models');

exports.getAllPurchases = async (req, res) => {
  try {
    const purchases = await Purchase.findAll({
      include: [
        { model: User, attributes: ['fullName'] },
        { model: Lesson, attributes: ['title'] },
        { model: Cursus, as: 'cursus', attributes: ['title'] }  // 👈 doit matcher l'alias du model
      ]
    });

    res.json(purchases);
  } catch (err) {
    console.error('Erreur getAllPurchases', err);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};


exports.deletePurchase = async (req, res) => {
  try {
    const id = req.params.id;
    const deleted = await Purchase.destroy({ where: { id } });

    if (!deleted) {
      return res.status(404).json({ message: "Achat non trouvé." });
    }

    res.json({ message: "Achat supprimé avec succès." });
  } catch (error) {
    console.error("Erreur deletePurchase:", error);
    res.status(500).json({ message: "Erreur serveur." });
  }
};
