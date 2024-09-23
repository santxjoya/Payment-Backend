const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Rol = require('./Rol');


const Person = sequelize.define('Person', {
    per_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    per_name: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    per_lastname: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    per_mail: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    per_password: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    per_status: {
        type: DataTypes.TINYINT(1),
        allowNull: false
    },
    rol_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Rol',
            key: 'rol_id'
        }
    },

}, {
    tableName: 'persons', // Especifica el nombre de la tabla si no sigue la convención de pluralización
    timestamps: false   // Desactiva los timestamps si la tabla no tiene createdAt y updatedAt
});

Person.belongsTo(Rol, { foreignKey: 'rol_id' });

module.exports = Person;
