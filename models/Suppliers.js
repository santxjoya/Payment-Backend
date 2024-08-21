const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Suppliers = sequelize.define('Suppliers', {
    sup_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    sup_name: {
        type: DataTypes.STRING(255),
        allowNull: false,
    }
}, {
    tableName: 'suppliers', // Especifica el nombre de la tabla si no sigue la convención de pluralización
    timestamps: false   // Desactiva los timestamps si la tabla no tiene createdAt y updatedAt
});
module.exports = Suppliers;