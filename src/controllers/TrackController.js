const Track = require("../models/TrackModel");
const sequelize = require("../db/sequelize_connection");
const sanitizeHtml = require('sanitize-html');
const [ Playlist ] = require("../models/PlaylistModel");
const {Op} = require("sequelize");
const {isLoggedIn} = require("../middleware/authMiddleware");

module.exports.uploadPage = async (req, res) => {
    res.render('upload-page');
};

module.exports.uploadTrack = async (req, res) => {
    for(let item of req.body) item = sanitizeHtml(item);

    const {title, genre, artists} = req.body;
    const path = req.file ? req.file.path : "public\\images\\placeholder.jpeg";
    const owner_id = req.session.user;

    await Track.create({owner_id, title, artists, genre, audio_url: path});

    res.redirect("/");
};

module.exports.trackPage = async (req, res) => {
    const trackId = req.params.trackId;

    const track = await Track.findByPk(trackId);
    const playlists = await Playlist.findAll({
        where: {
            owner_id: {
                [Op.eq]: req.session.user,
            },
        },
        raw: true,
    });

    const playlistsContainingTrack = await track.getPlaylists({raw: true});

    res.render('track-page', { track, playlists, playlistsContainingTrack, loggedIn: isLoggedIn(req)});
};

module.exports.addTrackToPlaylists = async (req, res) => {
    let playlistsIds_Array = [];
    if(!Array.isArray(req.body.playlists)) playlistsIds_Array.push(req.body.playlists);
    else playlistsIds_Array = req.body.playlists

    const track_SqlizeObject = await Track.findByPk(req.params.trackId);
    const playlistsContainingTrack = await track_SqlizeObject.getPlaylists({
        where: {
            owner_id:{
                [Op.eq]: req.session.user,
            },
        },
    });

    for(let playlist of playlistsContainingTrack){
        if(playlistsIds_Array.includes(playlist.getDataValue("id"))) await track_SqlizeObject.removePlaylist(playlist);
        playlistsIds_Array = playlistsIds_Array.filter((id) => {
            return id === playlist.getDataValue("id") ? false : true;
        });
    };

    for(let uuid of playlistsIds_Array){
        const playlist_SqlizeObject = await Playlist.findByPk(uuid);
        await track_SqlizeObject.addPlaylist(playlist_SqlizeObject);
    };

    this.trackPage(req, res);
}
