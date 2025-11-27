const sanitizeHtml = require('sanitize-html');
const {Op} = require("sequelize");
const Track = require('../models/TrackModel');
const User = require('../models/UserModel');
const [ Playlist ] = require('../models/PlaylistModel');
const { isLoggedIn } = require('./authMiddleware');

module.exports.search = async (req, res) => {
    const searchQuery = req.query ? sanitizeHtml(req.query.q).toLowerCase() : "";
    const filter = req.query.f ? sanitizeHtml(req.query.f).toLowerCase() : "";
    
    if(searchQuery == "") res.redirect("/");

    let playlists = [];
    let profiles = [];
    let tracks = [];

    const substringSearch = { [Op.substring]: `${searchQuery}`,}

    const titleQuery = filter == "" || filter.match("tr")  ? substringSearch : null;
    const genreQuery = filter == "" || filter.match("gn") ? substringSearch : null;
    const artistsQuery = filter == "" || filter.match("ar") ? substringSearch : null;
    
    if(!(titleQuery && genreQuery && artistsQuery)){
        tracks = await Track.findAll({
            where: {
                [Op.or]:{ 
                    title: titleQuery,
                    genre: genreQuery,
                    artists: artistsQuery
                },
            },
            raw: true,
        });

        tracks.map((track) => {track.isOwner = track.owner_id === req.session.user ? true : false});
    }
    
    if(filter == "" || filter.match("pl")){
        playlists = await Playlist.findAll({
            where: {
                title: substringSearch,
            },
            raw: true,
        });

        playlists.map((playlist) => {playlist.isOwner = playlist.owner_id === req.session.user ? true : false});
    }
    
    if(filter == "" || filter.match("pr")){
        profiles = await User.findAll({
            where: {
                username: substringSearch,
            },
            attributes: ['id', 'username'],
        });
    };


    if(searchQuery) res.render('home-page', {tracks, playlists, profiles, search: true, loggedIn: await isLoggedIn(req)});
};