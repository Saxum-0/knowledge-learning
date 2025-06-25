const ValidatedLesson = require('../../models/validatedLesson.model');
const User = require('../../models/user.model');
const Lesson = require('../../models/lesson.model');

exports.getAllValidatedLessons = async (req, res) => {
  try {
    const validations = await ValidatedLesson.findAll({
      include: [User, Lesson]
    });
    res.json(validations);
  } catch (error) {
    console.error("Erreur getAllValidatedLessons:", error);
    res.status(500).json({ message: "Erreur serveur." });
  }
};

exports.deleteValidatedLesson = async (req, res) => {
  const { userId, lessonId } = req.params;

  try {
    const deleted = await ValidatedLesson.destroy({
      where: { UserId: userId, LessonId: lessonId }
    });

    if (!deleted) {
      return res.status(404).json({ message: "Validation non trouvée." });
    }

    res.json({ message: "Validation supprimée avec succès." });
  } catch (error) {
    console.error("Erreur deleteValidatedLesson:", error);
    res.status(500).json({ message: "Erreur serveur." });
  }
};
