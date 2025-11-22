const Track = require("../models/TrackModel");
const sequelize = require("../db/sequelize_connection");

module.exports.uploadPage = async (req, res) => {
    res.render('upload-page');
};

module.exports.uploadTrack = async (req, res) => {
    const {title, genre, artists} = req.body;
    const owner_id = req.session.user;

    await Track.create({owner_id, title, artists, genre, audio_url: req.file.path});

    res.redirect("/");
};

module.exports.trackPage = async (req, res) => {
    const trackId = req.params.trackId;

    const track = await Track.findByPk(trackId, { raw: true });

    res.render('track-page', { track });
};
