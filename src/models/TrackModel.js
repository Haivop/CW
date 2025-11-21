const {DataTypes} = require("sequelize");
const sequelize = require("../db/connection");

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
            allowNull: false
        },
        title: {
            type: DataTypes.VARCHAR(50),
            allowNull: false
        },
        artists: {
            type: DataTypes.VARCHAR(50),
            allowNull: false
        },
        year: {
            type: DataTypes.YEAR,
        },
        genre: {
            type: DataTypes.VARCHAR(50),
            allowNull: false
        },
        image_url: {
            type: DataTypes.VARCHAR(100),
        },
        audio_url: {
            type: DataTypes.VARCHAR(100),
            allowNull: false
        },
    },
);

module.exports = Track;