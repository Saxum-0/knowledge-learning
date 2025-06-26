/**
 * @module models/Cursus
 * @description Sequelize model representing a course (Cursus).
 */

const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

/**
 * Represents a Cursus (training course).
 *
 * @typedef {Object} Cursus
 * @property {string} title - Title of the cursus (required).
 * @property {number} price - Price of the cursus (required).
 * @property {number} ThemeId - Foreign key referencing the associated theme (required).
 */
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
