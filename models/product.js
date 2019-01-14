const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const Product = sequelize.define('products', {
	id: {
		type: Sequelize.DataTypes.INTEGER,
		autoIncrement: true,
		allowNull: false,
		primaryKey: true
	},
	title: {
		type: Sequelize.DataTypes.STRING,
		allowNull: false
	},
	price: {
		type: Sequelize.DataTypes.DOUBLE,
		allowNull: false
	},
	imageUrl: {
		type: Sequelize.DataTypes.STRING,
		defaultValue: '/images/banner',
	},
	description: {
		type: Sequelize.DataTypes.STRING,
		allowNull: false
	}
});

module.exports = Product;
