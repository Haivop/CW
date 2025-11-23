const [ Playlist ] = require("../models/PlaylistModel");
const sequelize = require("../db/sequelize_connection");
const sanitizeHtml = require('sanitize-html');
const {isLoggedIn} = require("../middleware/authMiddleware");

module.exports.createPlaylist = async (req, res) => {
    const path = req.file ? req.file.path : "public\\images\\placeholder.jpeg";

    if(!req.body.title) throw new Error("null title");
    const title = sanitizeHtml(req.body.title);

    const owner_id = req.session.user;

    console.log(owner_id, title, path);

    await Playlist.create({owner_id, title, image_url: path});

    res.redirect('/catalogue');
};

module.exports.playlistPage = async (req, res) => {
    const playlist = await Playlist.findByPk(req.params.playlistId);

    const tracks = await playlist.getTracks({ raw: true });

    res.render('playlist-page', {playlist: playlist.toJSON(), tracks, loggedIn: isLoggedIn(req)});
};