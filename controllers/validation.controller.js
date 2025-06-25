const { Purchase, sequelize, ValidatedLesson, ValidatedCursus, Certification, Lesson, Cursus } = require('../models');

exports.validateLesson = async (req, res) => {
  const userId = req.user.id;
  const lessonId = req.params.id;

  try {
    const lesson = await Lesson.findByPk(lessonId);
    if (!lesson) return res.status(404).json({ message: "Leçon introuvable." });

    const already = await ValidatedLesson.findOne({
      where: { UserId: userId, LessonId: lessonId }
    });
    if (already) {
      return res.status(409).json({ message: "Leçon déjà validée." });
    }

    await ValidatedLesson.create({ UserId: userId, LessonId: lessonId });

    // 🔁 Vérifie les autres leçons du cursus
    const allLessons = await Lesson.findAll({ where: { CursusId: lesson.CursusId } });
    const lessonIds = allLessons.map(l => l.id);

    const validated = await ValidatedLesson.findAll({
      where: { UserId: userId, LessonId: lessonIds }
    });

    const purchased = await Purchase.findAll({
      where: { UserId: userId, LessonId: lessonIds }
    });

    const allValidated = validated.length === lessonIds.length;
    const allPurchased = purchased.length === lessonIds.length;

    if (allValidated && allPurchased) {
  // ✅ Crée ou trouve la validation de cursus
  const [validatedCursus] = await ValidatedCursus.findOrCreate({
    where: { UserId: userId, CursusId: lesson.CursusId }
  });

  // 🎓 Crée la certification si pas encore existante
  const [certif] = await Certification.findOrCreate({
    where: { UserId: userId, CursusId: lesson.CursusId }
  });
}


    res.status(200).json({ message: "Leçon validée avec succès." });
  } catch (err) {
    console.error("Erreur validation leçon :", err);
    res.status(500).json({ message: "Erreur serveur." });
  }
};


exports.validateCursus = async (req, res) => {
  const userId = req.user.id;
  const cursusId = req.params.id;

  try {
    const lessons = await Lesson.findAll({ where: { CursusId: cursusId } });

    for (const lesson of lessons) {
      await Purchase.findOrCreate({
        where: { UserId: userId, LessonId: lesson.id }
      });

      await ValidatedLesson.findOrCreate({
        where: { UserId: userId, LessonId: lesson.id }
      });
    }

    await ValidatedCursus.findOrCreate({
      where: { UserId: userId, CursusId: cursusId }
    });

    await Certification.findOrCreate({
      where: { UserId: userId, CursusId: cursusId }
    });

    res.status(200).json({ message: 'Cursus validé avec succès' });

  } catch (err) {
    console.error('Erreur validation cursus :', err);
    res.status(500).json({ message: 'Erreur serveur lors de la validation du cursus.' });
  }
};

exports.getMyValidations = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log('🔍 getMyValidations pour userId:', userId);

    const validatedLessons = await ValidatedLesson.findAll({
      where: { UserId: userId },
      attributes: ['LessonId']
    });
    const lessonIds = validatedLessons.map(v => v.LessonId);

    const validatedCursus = await ValidatedCursus.findAll({
      where: { UserId: userId },
      attributes: ['CursusId']
    });
    const cursusIds = validatedCursus.map(c => c.CursusId);

    res.json({ lessons: lessonIds, cursus: cursusIds });
  } catch (err) {
    console.error('❌ Erreur récupération validations :', err);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};
const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

exports.unvalidateLesson = async (req, res) => {
  const { id } = req.params
  const userId = req.user.id
  let retries = 3

  while (retries > 0) {
    try {
      const deleted = await ValidatedLesson.destroy({
        where: { UserId: userId, LessonId: id }
      })

      if (deleted) {
        return res.status(200).json({ message: "Leçon dévalidée." })
      } else {
        return res.status(404).json({ message: "Validation non trouvée." })
      }

    } catch (error) {
      if (error?.original?.code === 'SQLITE_BUSY') {
        retries--
        await delay(200) // attends 200ms avant de réessayer
      } else {
        console.error("Erreur unvalidateLesson :", error)
        return res.status(500).json({ message: "Erreur serveur." })
      }
    }
  }

  return res.status(500).json({ message: "Base de données occupée, réessaye." })
}

exports.unvalidateCursus = async (req, res) => {
  const userId = req.user.id
  const cursusId = req.params.id

  try {
    // Supprimer la validation du cursus
    await ValidatedCursus.destroy({
      where: { UserId: userId, CursusId: cursusId }
    })

    // Supprimer la certification liée (si elle existe)
    await Certification.destroy({
      where: { UserId: userId, CursusId: cursusId }
    })

    res.status(200).json({ message: 'Validation du cursus annulée ainsi que la certification ❌' })

  } catch (err) {
    console.error('Erreur suppression validation cursus :', err)
    res.status(500).json({ message: 'Erreur serveur lors de la suppression.' })
  }
}
