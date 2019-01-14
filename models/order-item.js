const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const OrderItem = sequelize.define('order_items', {
    id: {
        type: Sequelize.DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    quantity: Sequelize.DataTypes.INTEGER
});

module.exports = OrderItem;
