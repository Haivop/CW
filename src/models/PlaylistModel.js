const {DataTypes} = require("sequelize");
const sequelize = require("../db/sequelize_connection");
const Track = require("./TrackModel");

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
            type: DataTypes.CHAR(50),
            allowNull: false
        },
        image_url: {
            type: DataTypes.CHAR(100)
        }
    }
);

const Tracks_in_Playlist = sequelize.define('Tracks_in_Playlists', {
    TrackId: {
        type: DataTypes.UUID,
        field: 'track_id',
        references: {
            model: Track,
            key: 'id'
        },
    },
    PlaylistId: {
        type: DataTypes.UUID,
        field: 'playlist_id',
        references: {
            model: Playlist,
            key: 'id'
        },
    }
},
{
    timestamps:false,
});

Playlist.belongsToMany(Track, { through: Tracks_in_Playlist});
Track.belongsToMany(Playlist, { through: Tracks_in_Playlist});

console.log(sequelize.models);
module.exports = [Playlist, Tracks_in_Playlist];