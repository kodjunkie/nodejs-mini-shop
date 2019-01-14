const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const Cart = sequelize.define('carts', {
    id: {
        type: Sequelize.DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    }
});

module.exports = Cart;
