const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Certification = sequelize.define('Certification', {
  obtainedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
});

module.exports = Certification;
