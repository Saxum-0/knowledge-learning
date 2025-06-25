const Lesson = require('../../models/lesson.model');

exports.getAllLessons = async (req, res) => {
  try {
    const lessons = await Lesson.findAll();
    res.json(lessons);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur." });
  }
};

exports.createLesson = async (req, res) => {
  try {
    const { title, price, videoUrl, description, CursusId } = req.body;
    const newLesson = await Lesson.create({ title, price, videoUrl, description, CursusId });
    res.status(201).json(newLesson);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur." });
  }
};

exports.updateLesson = async (req, res) => {
  try {
    const lesson = await Lesson.findByPk(req.params.id);
    if (!lesson) return res.status(404).json({ message: "Leçon non trouvée." });

    await lesson.update(req.body);
    res.json(lesson);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur." });
  }
};

exports.deleteLesson = async (req, res) => {
  try {
    const lesson = await Lesson.findByPk(req.params.id);
    if (!lesson) return res.status(404).json({ message: "Leçon non trouvée." });

    await lesson.destroy();
    res.json({ message: "Leçon supprimée." });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur." });
  }
};
