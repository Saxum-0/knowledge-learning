/**
 * @module models/ValidatedLesson
 * @description Defines the ValidatedLesson model which represents the validation of a lesson by a user.
 */

const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

/**
 * Sequelize model for a validated lesson.
 * 
 * This model represents a many-to-many relationship between Users and Lessons, indicating
 * which lessons a user has completed. The composite primary key is made of `UserId` and `LessonId`.
 */
const ValidatedLesson = sequelize.define('ValidatedLesson', {
  /**
   * ID of the user who validated the lesson.
   * @type {number}
   */
  UserId: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },

  /**
   * ID of the validated lesson.
   * @type {number}
   */
  LessonId: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },

  /**
   * Timestamp when the lesson was validated.
   * @type {Date}
   */
  validatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'ValidatedLessons',
  timestamps: true
});

module.exports = ValidatedLesson;
