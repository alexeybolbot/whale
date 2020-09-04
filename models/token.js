const { DataTypes } = require('sequelize');
const db = require('../config/database');
const User = require('./user');

const Token = db.define('token', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    accessToken: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    expiresAt: {
        type: DataTypes.DATE,
        allowNull: false
    }
}, {
    timestamps: false
});

User.hasMany(Token, { foreignKey: { allowNull: false }, onDelete: "cascade" });

module.exports = Token;
