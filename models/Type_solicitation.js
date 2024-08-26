const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Type_Solicitation = sequelize.define('Type_Solicitation', {
    typ_sol_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    typ_sol_name: {
        type: DataTypes.STRING(255),
        allowNull: false,
    }
}, {
    tableName: 'type_solicitations', // Especifica el nombre de la tabla si no sigue la convención de pluralización
    timestamps: false   // Desactiva los timestamps si la tabla no tiene createdAt y updatedAt
});

module.exports = Type_Solicitation;