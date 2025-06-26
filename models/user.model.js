/**
 * @module models/User
 * @description Defines the User model which represents a registered user of the platform.
 */

const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

/**
 * Sequelize model for a User.
 * 
 * A user represents someone who can purchase courses or lessons, and who may have different roles (e.g., admin or client).
 * The account is secured with a hashed password and requires activation via email.
 */
const User = sequelize.define('User', {
  /**
   * Unique ID of the user.
   * @type {number}
   */
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },

  /**
   * Full name of the user.
   * @type {string}
   */
  fullName: {
    type: DataTypes.STRING,
    allowNull: false
  },

  /**
   * Email address used for login.
   * @type {string}
   */
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },

  /**
   * Hashed password of the user.
   * @type {string}
   */
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },

  /**
   * Role of the user: either 'client' or 'admin'.
   * @type {'client' | 'admin'}
   */
  role: {
    type: DataTypes.ENUM('client', 'admin'),
    defaultValue: 'client'
  },

  /**
   * Activation token used to verify the email address.
   * @type {string|null}
   */
  activationToken: {
    type: DataTypes.STRING,
    allowNull: true
  },

  /**
   * Indicates whether the account is active.
   * @type {boolean}
   */
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  timestamps: true
});

module.exports = User;
