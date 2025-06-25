// config/db.js
const { Sequelize } = require('sequelize');
require('dotenv').config();

const isTest = process.env.NODE_ENV === 'test';
const dbUrl = isTest ? process.env.DATABASE_URL_TEST : process.env.DATABASE_URL;

console.log('📦 Base utilisée par Sequelize :', dbUrl);

const sequelize = new Sequelize(dbUrl, {
  dialect: 'postgres',
  logging: false,
});

module.exports = sequelize;
