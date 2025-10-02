const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const User = sequelize.define('users', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    full_name: DataTypes.STRING,
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: DataTypes.STRING
}, {
    tableName: 'users',
    timestamps: true
});

module.exports = User