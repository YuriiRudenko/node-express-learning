const { Sequelize } = require('sequelize');
const sequelize = require('../helpers/database');

const CartItem = sequelize.define('cartItem', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    quantity: {
        type: Sequelize.INTEGER,
        defaultValue: 1,
    },
});

module.exports = CartItem;