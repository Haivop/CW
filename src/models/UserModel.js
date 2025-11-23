const {DataTypes} = require("sequelize");
const sequelize = require("../db/sequelize_connection");

const User = sequelize.define(
    'Users',
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV1,
            primaryKey:true,
        },
        username: {
            type: DataTypes.CHAR(30),
            allowNull: false
        },
        password:{
            type: DataTypes.CHAR(20),
            allowNull: false
        },
        email:{
            type: DataTypes.CHAR(30),
            allowNull: false,
        },
        avatar_url:{
            type: DataTypes.CHAR(100),
        }
    }
);

module.exports = User;