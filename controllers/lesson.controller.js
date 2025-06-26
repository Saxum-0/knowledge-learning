/**
 * Checks if the user has validated all lessons of a cursus and awards a certification if so.
 *
 * @async
 * @function checkAndAwardCertification
 * @param {number} userId - The ID of the user.
 * @param {number} lessonId - The ID of the validated lesson.
 * @returns {Promise<void>}
 *
 * @description
 * - Retrieves the lesson and its associated cursus.
 * - Fetches all lessons in the cursus.
 * - Compares them with the lessons already validated by the user.
 * - If all lessons are validated and the user doesn't already have the certification,
 *   a new certification is created.
 */
async function checkAndAwardCertification(userId, lessonId) {
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
        console.log(`🎓 Certification obtained for user ${userId}`);
      }
    }
  }
}
