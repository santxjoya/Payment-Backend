const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Area = require('./Area');

const Rol = sequelize.define('Rol', {
    rol_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    rol_name: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    are_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Area',
            key: 'are_id'
        }
    },
}, {
    tableName: 'roles', // Especifica el nombre de la tabla si no sigue la convención de pluralización
    timestamps: false   // Desactiva los timestamps si la tabla no tiene createdAt y updatedAt
});

Rol.belongsTo(Area, { foreignKey: 'are_id' });

module.exports = Rol;
