const User = require('../models/user.model');

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'fullName', 'email', 'role', 'isActive', 'createdAt']
    });

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }

    res.json(user);
  } catch (err) {
    console.error('Erreur getProfile:', err);
    res.status(500).json({ message: "Erreur serveur." });
  }
};

const bcrypt = require('bcrypt');

exports.updateProfile = async (req, res) => {
  const userId = req.user.id;
  const { fullName, password } = req.body;

  try {
    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé." });

    // Met à jour les champs si fournis
    if (fullName) user.fullName = fullName;
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
    }

    await user.save();
    res.json({ message: "Profil mis à jour avec succès." });

  } catch (err) {
    console.error("Erreur updateProfile :", err);
    res.status(500).json({ message: "Erreur serveur." });
  }
};
const Certification = require('../models/certification.model');
const Cursus = require('../models/cursus.model');

exports.getCertifications = async (req, res) => {
  const userId = req.user.id;

  try {
    const certifications = await Certification.findAll({
      where: { UserId: userId },
      include: {
        model: Cursus,
        attributes: ['title', 'price']
      }
    });

    res.json(certifications);
  } catch (err) {
    console.error("Erreur getCertifications :", err);
    res.status(500).json({ message: "Erreur serveur." });
  }
};
