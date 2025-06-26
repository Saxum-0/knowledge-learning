const { Certification, Cursus, User } = require('../models');

/**
 * @file Controller for certification-related operations.
 * @module controllers/certification.controller
 */

/**
 * Retrieves all certifications for the authenticated user.
 *
 * @async
 * @function getMyCertifications
 * @param {Object} req - Express request object, with `req.user.id` containing the authenticated user's ID.
 * @param {Object} res - Express response object used to return the certifications or an error.
 * @returns {Promise<void>}
 *
 * @example
 * // Route: GET /certifications/my
 * // Middleware: checkJWT must populate req.user
 */
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
    res.status(500).json({ message: 'Server error while fetching certifications.' });
  }
};



