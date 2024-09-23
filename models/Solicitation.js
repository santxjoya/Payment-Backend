const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Person = require('./Person');
const Suppliers = require('./Suppliers');
const Type_Solicitation = require('./Type_solicitation');
const Currencies = require('./Currencies');

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
            model: Person,  // Usar el modelo importado
            key: 'per_id'
        }
    },
    sup_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Suppliers,  // Usar el modelo importado
            key: 'sup_id'
        }
    },
    cur_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Currencies,  // Usar el modelo importado
            key: 'cur_id'
        }
    },
    typ_sol_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Type_Solicitation,  // Usar el modelo importado
            key: 'typ_sol_id'
        }
    },
}, {
    tableName: 'solicitations',
    timestamps: false
});

// Definir asociaciones
Solicitation.belongsTo(Person, { foreignKey: 'per_id' });
Solicitation.belongsTo(Suppliers, { foreignKey: 'sup_id' });
Solicitation.belongsTo(Type_Solicitation, { foreignKey: 'typ_sol_id' });
Solicitation.belongsTo(Currencies, { foreignKey: 'cur_id' });

module.exports = Solicitation;