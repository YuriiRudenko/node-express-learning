const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('node-complete', 'root', 'password', { dialect: 'mysql', host: 'localhost', logging: false });

module.exports = sequelize;