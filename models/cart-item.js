const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const CartItem = sequelize.define('cart_items', {
    id: {
        type: Sequelize.DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    quantity: Sequelize.DataTypes.INTEGER
});

module.exports = CartItem;
