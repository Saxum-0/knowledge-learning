const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Cursus = sequelize.define('Cursus', {
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  ThemeId: {
  type: DataTypes.INTEGER,
  allowNull: false
  }

});

module.exports = Cursus;
