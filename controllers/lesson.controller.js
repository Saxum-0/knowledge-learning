// Vérification lessons of cursus
const lesson = await Lesson.findByPk(lessonId);
if (lesson && lesson.CursusId) {
  const allLessons = await Lesson.findAll({ where: { CursusId: lesson.CursusId } });

  const validatedLessons = await ValidatedLesson.findAll({
    where: {
      UserId: userId,
      LessonId: allLessons.map(l => l.id)
    }
  });

  if (validatedLessons.length === allLessons.length) {
    // verify certification
    const alreadyCertified = await Certification.findOne({
      where: {
        UserId: userId,
        CursusId: lesson.CursusId
      }
    });

    if (!alreadyCertified) {
      await Certification.create({
        UserId: userId,
        CursusId: lesson.CursusId,
        obtainedAt: new Date()
      });
      console.log("🎓 Certification obtenue pour l'utilisateur ${userId}");
    }
  }
}