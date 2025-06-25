const { Purchase, Lesson, Cursus } = require('../models');


// POST: Acheter une leçon
exports.buyLesson = async (req, res) => {
  const userId = req.user.id;
  const lessonId = req.params.id;

  try {
    const lesson = await Lesson.findByPk(lessonId);
    if (!lesson) {
      return res.status(404).json({ message: "Leçon introuvable." });
    }

    console.log({ UserId: userId, LessonId: lesson.id });

    // Vérifie si déjà achetée
    const alreadyPurchased = await Purchase.findOne({
      where: { UserId: userId, LessonId: lesson.id }
    });

    if (alreadyPurchased) {
      return res.status(409).json({ message: "Leçon déjà achetée." });
    }

    // Enregistre l’achat
    await Purchase.create({
      UserId: userId,
      LessonId: lesson.id
    });

    res.status(201).json({ message: "Leçon achetée avec succès." });

  } catch (error) {
    console.error("Erreur achat leçon :", error.message, error.stack);
    res.status(500).json({ message: "Erreur serveur." });
  }
};

// POST: Acheter un cursus
exports.buyCursus = async (req, res) => {
  const userId = req.user.id;
  const cursusId = req.params.id;

  try {
    const cursus = await Cursus.findByPk(cursusId);

    if (!cursus) {
      return res.status(404).json({ message: "Cursus introuvable." });
    }

    const already = await Purchase.findOne({
      where: { UserId: userId, CursusId: cursus.id }
    });

    if (already) {
      return res.status(409).json({ message: "Cursus déjà acheté." });
    }

    await Purchase.create({
      UserId: userId,
      CursusId: cursus.id
    });

    res.status(201).json({ message: "Cursus acheté avec succès." });

  } catch (err) {
    console.error("Erreur achat cursus :", err.message, err.stack);
    res.status(500).json({ message: "Erreur serveur." });
  }
};

// GET: Toutes les leçons achetées (directes ou via cursus)
const { Op } = require('sequelize');

exports.getMyLessons = async (req, res) => {
  try {
    const userId = req.user.id;

    // 1. Leçons achetées directement
    const directLessons = await Lesson.findAll({
      attributes: ['id', 'title', 'description', 'videoUrl', 'price', 'CursusId', 'createdAt'],
      include: [
        {
          model: Purchase,
          where: { UserId: userId },
          required: true
        }
      ]
    });

    // 2. Cursus achetés
    const purchasedCursus = await Purchase.findAll({
      attributes: ['CursusId'],
      where: {
        UserId: userId,
        CursusId: { [Op.ne]: null }
      }
    });

    const cursusIds = purchasedCursus.map(p => p.CursusId);

    // 3. Leçons liées aux cursus
    const lessonsFromCursus = await Lesson.findAll({
      where: { CursusId: cursusIds },
      attributes: ['id', 'title', 'description', 'videoUrl', 'price', 'CursusId', 'createdAt']
    });

    // 4. Fusionner et dédupliquer
    const allLessons = [...directLessons, ...lessonsFromCursus];
    const uniqueLessonsMap = new Map();
    allLessons.forEach(lesson => uniqueLessonsMap.set(lesson.id, lesson));

    res.json(Array.from(uniqueLessonsMap.values()));
  } catch (error) {
    console.error('Erreur getMyLessons :', error);
    res.status(500).json({ message: 'Erreur récupération leçons achetées' });
  }
};


// controllers/buy.controller.js


exports.getMyCursus = async (req, res) => {
  try {
    const userId = req.user.id;

    // 1. Cursus achetés directement
    const directCursusPurchases = await Purchase.findAll({
      where: {
        UserId: userId,
        CursusId: { [Op.ne]: null }
      },
      include: [{
      model: Cursus,
      as: 'cursus' // ← correspond à ton alias défini dans les associations
}]

    });
    const directCursusIds = directCursusPurchases.map(p => p.CursusId);

    // 2. Leçons achetées
    const lessonPurchases = await Purchase.findAll({
      where: {
        UserId: userId,
        LessonId: { [Op.ne]: null }
      }
    });

    const purchasedLessonIds = lessonPurchases.map(p => p.LessonId);

    // 3. Vérifie si un cursus a toutes ses leçons achetées
    const allCursus = await Cursus.findAll({
      include: [{ model: Lesson, as: 'lessons' }]
    });

    const extraCursus = allCursus.filter(c => {
      if (!c.lessons || c.lessons.length === 0) return false;
      const allLessonsBought = c.lessons.every(lesson =>
        purchasedLessonIds.includes(lesson.id)
      );
      return allLessonsBought && !directCursusIds.includes(c.id);
    });

    // 4. Fusionne sans doublons
    const fullCursusList = [
      ...directCursusPurchases.map(p => p.cursus),
      ...extraCursus
    ];

    res.json(fullCursusList);
  } catch (err) {
    console.error('Erreur getMyCursus:', err);
    res.status(500).json({ message: 'Erreur récupération cursus achetés' });
  }
};
