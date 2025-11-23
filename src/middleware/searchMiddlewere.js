const sanitizeHtml = require('sanitize-html');
const {Op} = require("sequelize");
const Track = require('../models/TrackModel');
const [ Playlist ] = require('../models/PlaylistModel');

module.exports.search = async (req, res) => {
    const searchQuery = req.query ? sanitizeHtml(req.query.q).toLowerCase() : "";
    const filter = req.query ? sanitizeHtml(req.query.f).toLowerCase() : "";

    if(searchQuery == "") res.redirect("/");

    console.log(searchQuery);
    
    const tracks = await Track.findAll({
        where: {
            [Op.or]: {
                title: {
                    [Op.substring]: `${searchQuery}`,
                },
                genre: {
                    [Op.substring]: `${searchQuery}`,
                },
                artists: {
                    [Op.substring]: `${searchQuery}`,
                },
            }
        },
        raw: true,
    });

    console.log(tracks);

    const playlists = await Playlist.findAll({
        where: {
            title: {
                [Op.substring]: `${searchQuery}`
            },
        },
        raw: true,
    });

    if(searchQuery) res.render('home-page', {tracks, playlists});
};