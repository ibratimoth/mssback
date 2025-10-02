const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Request = sequelize.define('requests', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    service: {
        type: DataTypes.JSONB,
        allowNull: false
    },
    full_name: DataTypes.STRING,
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    organisation: {
        type: DataTypes.STRING,
        allowNull: false
    },
    ticket_number: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'requests',
    timestamps: true
});

module.exports = Request