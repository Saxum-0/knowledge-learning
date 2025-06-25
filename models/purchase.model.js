const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./user.model');
const Lesson = require('./lesson.model');
const Cursus = require('./cursus.model');

const Purchase = sequelize.define('Purchase', {});

Purchase.belongsTo(User);
User.hasMany(Purchase);

Purchase.belongsTo(Lesson);
Lesson.hasMany(Purchase);

Purchase.belongsTo(Cursus, { foreignKey: 'CursusId' });
Cursus.hasMany(Purchase, { foreignKey: 'CursusId' });

module.exports = Purchase;
