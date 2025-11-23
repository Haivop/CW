const Track = require("../models/TrackModel");
const sequelize = require("../db/sequelize_connection");
const sanitizeHtml = require('sanitize-html');
const [ Playlist ] = require("../models/PlaylistModel");
const {Op} = require("sequelize");

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

    const track = await Track.findByPk(trackId, { raw: true });
    const playlists = await Playlist.findAll({
        where: {
            owner_id: {
                [Op.eq]: req.session.user,
            },
        },
        raw: true,
    });

    res.render('track-page', { track, playlists });
};

module.exports.addTrackToPlaylists = async (req, res) => {
    console.log(req.body, req.params);
    
    for(let id of req.body.playlists){
        const playlist = await Playlist.findByPk(id);
        playlist.addTrack(await Track.findByPk(req.params.trackId));
    }

}
