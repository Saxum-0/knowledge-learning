const Certification = require('../../models/certification.model');
const User = require('../../models/user.model');
const Cursus = require('../../models/cursus.model');

exports.getAllCertifications = async (req, res) => {
  try {
    const certifications = await Certification.findAll({
      include: [User, Cursus]
    });
    res.json(certifications);
  } catch (error) {
    console.error("Erreur getAllCertifications:", error);
    res.status(500).json({ message: "Erreur serveur." });
  }
};

exports.deleteCertification = async (req, res) => {
  try {
    const deleted = await Certification.destroy({ where: { id: req.params.id } });

    if (!deleted) return res.status(404).json({ message: "Certification non trouvée." });

    res.json({ message: "Certification supprimée avec succès." });
  } catch (error) {
    console.error("Erreur deleteCertification:", error);
    res.status(500).json({ message: "Erreur serveur." });
  }
};
