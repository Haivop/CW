const {DataTypes} = require("sequelize");
const sequelize = require("../db/sequelize_connection");
const User = require("./UserModel");
const [ Playlist ] = require("./PlaylistModel");
const Track = require("./TrackModel");

//Created playlists catalogue
User.hasMany(Playlist, {
    foreignKey: {
        name: 'owner_id',
        type: DataTypes.UUID
    }
});
Playlist.belongsTo(User, {
    foreignKey: {
        name: 'owner_id',
        type: DataTypes.UUID
    }
});

//Uploaded tracks catalogue
User.hasMany(Track, {
    foreignKey: {
        name: 'owner_id',
        type: DataTypes.UUID
    }
});
Track.belongsTo(User, {
    foreignKey: {
        name: 'owner_id',
        type: DataTypes.UUID
    }
});

const LikedTracksCatalogue = sequelize.define('Liked_Catalogues', {
    UserId: {
        type: DataTypes.UUID,
        field: 'user_id',
        references: {
            model: User,
            key: 'id'
        },
    },
    TrackId: {
        type: DataTypes.UUID,
        field: 'track_id',
        references: {
            model: Track,
            key: 'id'
        },
    },
},
{
    timestamps:false,
});

Track.belongsToMany(User, {
    through: LikedTracksCatalogue,
    foreignKey: "track_id",
    otherKey: "user_id"
});
User.belongsToMany(Track, {
    through: LikedTracksCatalogue,
    foreignKey: "user_id",
    otherKey: "track_id"
});

const PlaylistCatalogue = sequelize.define('Playlist_Catalogues', {
    UserId: {
        type: DataTypes.UUID,
        field: 'user_id',
        references: {
            model: User,
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

Playlist.belongsToMany(User, {through: PlaylistCatalogue, foreignKey: 'playlist_id', otherKey: 'user_id'});
User.belongsToMany(Playlist, {through: PlaylistCatalogue, foreignKey: 'user_id', otherKey: 'playlist_id'});

console.log(sequelize.models);

(async () => { await sequelize.sync() })();

module.exports = [LikedTracksCatalogue, PlaylistCatalogue];
