const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Person = require('./Person');
const Solicitation = require('./Solicitation');

const New = sequelize.define('New', {
    new_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    new_description: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    new_status: {
        type: DataTypes.TINYINT,
        allowNull: false
    },
    per_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Person',
            key: 'per_id'
        }
    },
    sol_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Solicitation',
            key: 'sol_id'
        }
    },
    new_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    }
}, {
    tableName: 'news', // Especifica el nombre de la tabla si no sigue la convención de pluralización
    timestamps: false   // Desactiva los timestamps si la tabla no tiene createdAt y updatedAt
});
New.belongsTo(Person, { foreignKey: 'per_id' });
New.belongsTo(Solicitation, { foreignKey: 'sol_id' });

module.exports = New;