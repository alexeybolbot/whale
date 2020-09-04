const { DataTypes } = require('sequelize');
const db = require('../config/database');

const TypeId = db.define('typeid', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    nm: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    timestamps: false
});

module.exports = TypeId;