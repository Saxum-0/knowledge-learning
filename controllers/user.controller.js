const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const Certification = require('../models/certification.model');
const Cursus = require('../models/cursus.model');

/**
 * Get the profile of the currently authenticated user.
 *
 * @route GET /user/profile
 * @access Private
 * @param {Object} req - Express request object containing authenticated user.
 * @param {Object} res - Express response object.
 * @returns {Object} - User profile data or error message.
 */
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

/**
 * Update the profile information of the authenticated user.
 *
 * @route PUT /user/profile
 * @access Private
 * @param {Object} req - Express request object with user ID and updated data.
 * @param {Object} res - Express response object.
 * @returns {Object} - Success message or error.
 */
exports.updateProfile = async (req, res) => {
  const userId = req.user.id;
  const { fullName, password } = req.body;

  try {
    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé." });

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

/**
 * Retrieve all certifications obtained by the authenticated user.
 *
 * @route GET /user/certifications
 * @access Private
 * @param {Object} req - Express request object with authenticated user ID.
 * @param {Object} res - Express response object.
 * @returns {Array} - List of certifications with cursus info.
 */
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
