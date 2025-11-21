const {DataTypes} = require("sequelize");
const sequelize = require("../db/connection");
const Playlist = require("./PlaylistModel");
const Track = require("./TrackModel");

const User = sequelize.define(
    'Users',
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV1,
            primaryKey:true,
            allowNull: false
        },
        username: {
            type: DataTypes.VARCHAR(30),
            allowNull: false
        },
        password:{
            type: DataTypes.VARCHAR(20),
            allowNull: false
        },
        email:{
            type: DataTypes.VARCHAR(30),
            allowNull: false,
        },
        avatar_url:{
            type: DataTypes.VARCHAR(100),
        }
    }
);

//Created
User.hasMany(Playlist, {
    foreignKey: {
        name: 'owner_id',
        type: DataTypes.UUID
    }
});
Playlist.belongsTo(User);

//Uploaded
User.hasMany(Track, {
    foreignKey: {
        name: 'owner_id',
        type: DataTypes.UUID
    }
})
Track.belongsTo(User);

Track.belongsToMany(User, {through: 'Liked_Catalogues'});
User.belongsToMany(Track, {through: 'Liked_Catalogues'});

Playlist.belongsToMany(User, {through: 'Playlist_Catalogues'});
User.belongsToMany(Playlist, {through: 'Playlist_Catalogues'});

module.exports = User;