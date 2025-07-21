const { Sequelize } = require('sequelize');
require('dotenv').config();

const isTest = process.env.NODE_ENV === 'test';
const dbUrl = isTest ? process.env.DATABASE_URL_TEST : process.env.DATABASE_URL;

console.log('📦 Base utilisée par Sequelize :', dbUrl);

const sequelize = new Sequelize(dbUrl, {
  dialect: 'postgres',
  protocol: 'postgres',
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false // très important pour Render
    }
  }
});

module.exports = sequelize;
