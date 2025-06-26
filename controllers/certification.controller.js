const { Certification, Cursus, User } = require('../models');

// controllers/certification.controller.js
exports.getMyCertifications = async (req, res) => {
  try {
    const userId = req.user.id;

    const certifs = await Certification.findAll({
  where: { UserId: userId },
  include: [
    { model: Cursus, as: 'cursus', attributes: ['title'] },
    { model: User, as: 'user', attributes: ['fullName'] }
  ]
});


    res.json(certifs);
  } catch (err) {
    console.error('Erreur getMyCertifications', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};
