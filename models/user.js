const { DataTypes } = require('sequelize');
const db = require('../config/database');
const TypeId = require('./typeid');

const User = db.define('user', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    timestamps: false
});

TypeId.hasMany(User, { foreignKey: { allowNull: false }, onDelete: "cascade" });
User.belongsTo(TypeId);

module.exports = User;