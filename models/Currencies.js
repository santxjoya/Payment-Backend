const {DataTypes} = require('sequelize');
const sequelize = require('../config/database');

const Currencies = sequelize. define('Currencies',
    {
        cur_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        cur_name: {
            type: DataTypes.STRING(255),
            allowNull: false,
        }	
    },{
        tableName: 'currencies', // Especifica el nombre de la tabla si no sigue la convención de pluralización
    timestamps: false   // Desactiva los timestamps si la tabla no tiene createdAt y updatedAt
    }
);
module.exports = Currencies;