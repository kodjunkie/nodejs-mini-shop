const Sequelize = require('sequelize');

const sequelize = new Sequelize('v8app', 'root', 'secret', {
    dialect: 'mysql',
    host: '127.0.0.1',
});

module.exports = sequelize;