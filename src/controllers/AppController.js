const sequelize = require("sequelize");
const [ Playlist ] = require("../models/PlaylistModel");
const Track = require("../models/TrackModel");

module.exports.hubPage = async (req, res) => {
    let tracks = await Track.findAll({
        raw: true,
        order: sequelize.col('likes'),
        limit: 10,
    });

    const playlists = await Playlist.findAll({
        raw: true,
        limit: 10,
    });

    console.log(playlists);

    res.render('home-page', { tracks, playlists });
}; 