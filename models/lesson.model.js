// models/lesson.model.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Lesson = sequelize.define('Lesson', {
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  videoUrl: {
    type: DataTypes.STRING,
    allowNull: true
  },
  CursusId: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
});

module.exports = Lesson;
