const {Op} = require ("sequelize");

const sequelize = require("../db/sequelize_connection");
const [ Playlist ] = require("../models/PlaylistModel");
const Track = require("../models/TrackModel");
const [ LikedTracksCatalogue , PlaylistCatalogue ] = require("../models/CataloguesModel");

module.exports.catalogPage = async (req, res) => {
    const catalogueType = req.query.t == undefined ? "none" : req.query.t;
    const userId = req.session.user;
    
    const {
        uploaded_tracks, 
        created_playlists, 
        saved_playlists, 
        liked_tracks
    } = await this.getCataloguesOfUser(userId, catalogueType);

    res.render("catalogue-page", {
        uploaded_tracks, 
        created_playlists, 
        saved_playlists, 
        liked_tracks, 
        catalogueType, 
        loggedIn: true
    });
};

module.exports.getCataloguesOfUser = async (userId, catalogueType) => {
    const createdQuery = {
        where: {
            owner_id: {
                [Op.eq]: userId,
            },
        },
        raw: true,
    };

    const savedQuery = {
        where: {
            user_id: {
                [Op.eq]: userId,
            },
        },
        raw: true,
    };

    let uploaded_tracks = [];
    let created_playlists = [];
    let saved_playlists = [];
    let liked_tracks = [];
    
    if(catalogueType === "none" || catalogueType.match("upl")) {
        uploaded_tracks = await Track.findAll(createdQuery);
        uploaded_tracks = uploaded_tracks.map((track) => {
            track.isOwner = track.owner_id === userId;
        });
    }
    if(catalogueType === "none" || catalogueType.match("cr")) {
        created_playlists = await Playlist.findAll(createdQuery);
        created_playlists = created_playlists.map((playlist) => {
            playlist.isOwner = playlist.owner_id === userId
        });
    }
    if(catalogueType === "none" || catalogueType.match("sv")) {
        saved_playlists = await this.getSavedPlaylists(savedQuery);
        saved_playlists = saved_playlists.map((playlist) => {
            playlist.isOwner = playlist.owner_id === userId
        });
    }
    if(catalogueType === "none" || catalogueType.match("lk")){
        liked_tracks = await this.getLikedTracks(savedQuery);
        liked_tracks = liked_tracks.map((track) => {
            track.isOwner = track.owner_id === userId
        });
        uploaded_tracks.map((track) => {
            track.isLiked = liked_tracks.includes(track);
        });
    }

    return {
        uploaded_tracks, 
        created_playlists, 
        saved_playlists, 
        liked_tracks
    };
};

module.exports.getSavedPlaylists = async function (savedQuery) {
    const saved_playlists = [];
    const saved_playlists_id_collection = await PlaylistCatalogue.findAll(savedQuery);

    for(let playlist of saved_playlists_id_collection){
        const savedPlaylist = await Playlist.findByPk(playlist.playlist_id, {raw: true});
        saved_playlists.push(savedPlaylist);
    }

    return saved_playlists;
}

module.exports.getLikedTracks = async function (savedQuery) {
    const liked_tracks = [];
    const liked_tracks_id_collection = await LikedTracksCatalogue.findAll(savedQuery);

    for(let track of liked_tracks_id_collection){
        const likedTrack = await Track.findByPk(track.track_id, {raw: true});
        liked_tracks.push(likedTrack);
    }

    return liked_tracks
}