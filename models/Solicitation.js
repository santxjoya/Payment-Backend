const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Person = require('./Person');
const Suppliers = require('./Suppliers');

const Solicitation = sequelize.define('Solicitation', {
    sol_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    sol_status: {
        type: DataTypes.TINYINT,
        allowNull: false
    },
    sol_cost: {
        type: DataTypes.DOUBLE,
        allowNull: false
    },
    sol_description: {
        type: DataTypes.STRING(255),
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
    sup_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Suppliers',
            key: 'sup_id'
        }
    },
    cur_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Currencies',
            key: 'cur_id'
        }
    },
    typ_sol_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Type_solicitation',
            key: 'typ_sol_id'
        }
    },

}, {
    tableName: 'solicitations', // Especifica el nombre de la tabla si no sigue la convención de pluralización
    timestamps: false   // Desactiva los timestamps si la tabla no tiene createdAt y updatedAt
});

Solicitation.belongsTo(Person, { foreignKey: 'per_id' });
Solicitation.belongsTo(Suppliers, { foreignKey: 'sup_id' });

module.exports = Solicitation;