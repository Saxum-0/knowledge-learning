const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const ValidatedLesson = sequelize.define('ValidatedLesson', {
  UserId: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  LessonId: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  validatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'ValidatedLessons',
  timestamps: true
});

module.exports = ValidatedLesson;
