const { Sequelize } = require('sequelize');
const sequelize = require('../helpers/database');

const Product = sequelize.define('product', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    title: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    price: {
        type: Sequelize.FLOAT,
        allowNull: false,
    },
    description: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    imageUrl: {
        type: Sequelize.STRING,
        allowNull: false,
    }
});

module.exports = Product;