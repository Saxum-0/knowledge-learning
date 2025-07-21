const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const ValidatedCursus = sequelize.define('ValidatedCursus', {
  UserId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  CursusId: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
});

module.exports = ValidatedCursus;
