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
            allowNull: false,
            unique: true,
        },
        password:{
            type: DataTypes.TEXT,
            allowNull: false
        },
        email:{
            type: DataTypes.CHAR(30),
            allowNull: false,
        },
        avatar_url:{
            type: DataTypes.CHAR(100),
            defaultValue: "public\\images\\placeholder\\placeholder.jpeg"
        },
        block_flag:{
            type: DataTypes.BOOLEAN,
            defaultValue: 0
        },
        password_salt:{
            type: DataTypes.CHAR(129),
            allowNull: false,
        }
    }
);

module.exports = User;