const [ Playlist ] = require("../models/PlaylistModel");
const sequelize = require("../db/sequelize_connection");
const Track = require("../models/TrackModel");

module.exports.createPlaylist = async (req, res) => {
    const {title} = req.body;
    owner_id = 'b56cf590-c6c1-11f0-b81e-1122d3e5ee76';

    await Playlist.create({owner_id, title, image_url: req.file.path});

    res.redirect('/catalogue')
};

module.exports.playlistPage = async (req, res) => {
    const playlist = await Playlist.findByPk(req.params.playlistId);

    const tracks = await playlist.getTracks({ raw: true });

    console.log(playlist.toJSON(), tracks);

    res.render('playlist-page', {playlist: playlist.toJSON(), tracks});
};