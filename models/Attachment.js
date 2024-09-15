const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Attachment = sequelize.define('Attachment', {
    att_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    att_name: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    att_url: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    sol_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Solicitation',
            key: 'sol_id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    }
}, {
    tableName: 'attachments',
    timestamps: false
});

module.exports = Attachment;
