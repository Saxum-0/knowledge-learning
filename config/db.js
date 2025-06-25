const { Sequelize } = require('sequelize');
require('dotenv').config();

const isTest = process.env.NODE_ENV === 'test';
const dbFile = isTest ? './test.db' : './dev.db';

// 🔍 LOG utile pour confirmation
console.log('📦 Base utilisée par Sequelize : sqlite:' + dbFile);

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: dbFile,
  logging: false,
  dialectOptions: {
    mode:
      require('sqlite3').OPEN_READWRITE |
      require('sqlite3').OPEN_CREATE |
      require('sqlite3').OPEN_FULLMUTEX
  }
});

module.exports = sequelize;
