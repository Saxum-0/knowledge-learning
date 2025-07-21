/**
 * @module models/index
 * @description Initializes Sequelize and defines associations between all models.
 */

const sequelize = require('../config/db');

const User = require('./user.model');
const Theme = require('./theme.model');
const Cursus = require('./cursus.model');
const Lesson = require('./lesson.model');
const Purchase = require('./purchase.model');
const ValidatedCursus = require('./validatedCursus.model');
const ValidatedLesson = require('./validatedLesson.model');
const Certification = require('./certification.model');

// === RELATIONS ===

/**
 * Theme has many Cursus
 */
Theme.hasMany(Cursus, { foreignKey: 'ThemeId', as: 'cursus', onDelete: 'CASCADE' });
Cursus.belongsTo(Theme, { foreignKey: 'ThemeId', as: 'theme' });

/**
 * Cursus has many Lessons
 */
Cursus.hasMany(Lesson, { foreignKey: 'CursusId', as: 'lessons', onDelete: 'CASCADE' });
Lesson.belongsTo(Cursus, { foreignKey: 'CursusId', as: 'cursus' });

/**
 * User has many Purchases (of lessons or cursus)
 */
User.hasMany(Purchase, { foreignKey: 'UserId', onDelete: 'CASCADE' });
Purchase.belongsTo(User, { foreignKey: 'UserId' });

Lesson.hasMany(Purchase, { foreignKey: 'LessonId', onDelete: 'CASCADE' });
Purchase.belongsTo(Lesson, { foreignKey: 'LessonId' });

Cursus.hasMany(Purchase, { foreignKey: 'CursusId', as: 'purchases', onDelete: 'CASCADE' });
Purchase.belongsTo(Cursus, { foreignKey: 'CursusId', as: 'cursus' });

/**
 * Many-to-many: Users <-> Validated Cursus
 */
User.belongsToMany(Cursus, { through: ValidatedCursus, foreignKey: 'UserId', otherKey: 'CursusId' });
Cursus.belongsToMany(User, { through: ValidatedCursus, foreignKey: 'CursusId', otherKey: 'UserId' });

ValidatedCursus.belongsTo(Cursus, { foreignKey: 'CursusId', onDelete: 'CASCADE' });
ValidatedCursus.belongsTo(User, { foreignKey: 'UserId', onDelete: 'CASCADE' });

User.hasMany(ValidatedCursus, { foreignKey: 'UserId', onDelete: 'CASCADE' });
Cursus.hasMany(ValidatedCursus, { foreignKey: 'CursusId', onDelete: 'CASCADE' });

/**
 * Validated lessons per user
 */
ValidatedLesson.belongsTo(User, { foreignKey: 'UserId', onDelete: 'CASCADE' });
ValidatedLesson.belongsTo(Lesson, { foreignKey: 'LessonId', onDelete: 'CASCADE' });

User.hasMany(ValidatedLesson, { foreignKey: 'UserId', onDelete: 'CASCADE' });
Lesson.hasMany(ValidatedLesson, { foreignKey: 'LessonId', onDelete: 'CASCADE' });

/**
 * Certifications obtained by users
 */
Certification.belongsTo(Cursus, { foreignKey: 'CursusId', as: 'cursus', onDelete: 'CASCADE' });
Cursus.hasMany(Certification, { foreignKey: 'CursusId', as: 'certifications', onDelete: 'CASCADE' });

Certification.belongsTo(User, { foreignKey: 'UserId', as: 'user', onDelete: 'CASCADE' });
User.hasMany(Certification, { foreignKey: 'UserId', as: 'certifications', onDelete: 'CASCADE' });

/**
 * Exports all models and Sequelize instance
 */
module.exports = {
  sequelize,
  User,
  Theme,
  Cursus,
  Lesson,
  Purchase,
  ValidatedLesson,
  ValidatedCursus,
  Certification,
};
