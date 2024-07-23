const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('inMartketDB', 'root', '', {
    host: 'localhost',
    dialect: 'mysql'
});

module.exports = sequelize;
