const {DataTypes} = require("sequelize");
const sequelize = require("../db/sequelize_connection");

const Track = sequelize.define(
    'Tracks',
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV1,
            primaryKey:true,
            allowNull: false
        },
        owner_id: {
            type: DataTypes.UUID,
        },
        title: {
            type: DataTypes.CHAR(50),
            allowNull: false
        },
        artists: {
            type: DataTypes.CHAR(50),
            allowNull: false
        },
        genre: {
            type: DataTypes.CHAR(50),
            allowNull: false
        },
        likes: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        image_url: {
            type: DataTypes.CHAR(100),
        },
        audio_url: {
            type: DataTypes.CHAR(100),
            allowNull: false
        },
        public_flag: {
            type: DataTypes.BOOLEAN,
            defaultValue: 0,
        },
    },
);

module.exports = Track;