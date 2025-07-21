const User = require('../../models/user.model');

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    console.error("Erreur getAllUsers:", error);
    res.status(500).json({ message: "Erreur serveur." });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé." });
    res.json(user);
  } catch (error) {
    console.error("Erreur getUserById:", error);
    res.status(500).json({ message: "Erreur serveur." });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { fullName, email, role, isActive } = req.body;
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé." });

    await user.update({ fullName, email, role, isActive });
    res.json({ message: "Utilisateur mis à jour." });
  } catch (error) {
    console.error("Erreur updateUser:", error);
    res.status(500).json({ message: "Erreur serveur." });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const deleted = await User.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ message: "Utilisateur non trouvé." });

    res.json({ message: "Utilisateur supprimé avec succès." });
  } catch (error) {
    console.error("Erreur deleteUser:", error);
    res.status(500).json({ message: "Erreur serveur." });
  }
};
