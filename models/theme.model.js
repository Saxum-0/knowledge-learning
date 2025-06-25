const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Theme = sequelize.define('Theme', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

module.exports = Theme;
