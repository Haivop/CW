const {DataTypes} = require("sequelize");
const sequelize = require("../db/connection");
const User = require("./UserModel");

const Playlist = sequelize.define(
    'Playlists',
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV1,
            primaryKey:true,
            allowNull: false
        },
        owner_id: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        title: {
            type: DataTypes.VARCHAR(50),
            allowNull: false
        },
        image_url: {
            type: DataTypes.VARCHAR(100)
        }
    },
    { timestamps: false }
);

module.exports = Playlist;