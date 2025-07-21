/**
 * @module models/Lesson
 * @description Defines the Lesson model which represents an individual lesson linked to a cursus.
 */

const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

/**
 * Sequelize model for a Lesson.
 * 
 * A lesson belongs to a cursus and can be purchased individually or through the associated cursus.
 * Each lesson has a title, price, optional description, and an optional video URL.
 */
const Lesson = sequelize.define('Lesson', {
  /**
   * Title of the lesson.
   * @type {string}
   */
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },

  /**
   * Price of the lesson (in euros).
   * @type {number}
   */
  price: {
    type: DataTypes.FLOAT,
    allowNull: false
  },

  /**
   * Optional description of the lesson.
   * @type {string}
   */
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },

  /**
   * URL to the lesson's video content.
   * @type {string}
   */
  videoUrl: {
    type: DataTypes.STRING,
    allowNull: true
  },

  /**
   * Foreign key: ID of the associated Cursus.
   * @type {number}
   */
  CursusId: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
});

module.exports = Lesson;
