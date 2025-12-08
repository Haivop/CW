const sanitizeHtml = require('sanitize-html');
const {Op} = require("sequelize");
const Track = require('../models/TrackModel');
const User = require('../models/UserModel');
const [ Playlist ] = require('../models/PlaylistModel');
const { isLoggedIn } = require('./authMiddleware');
const { appendTracksMeta, appendPlaylistsMeta } = require('./utility');

module.exports.search = async (req, res) => {
    const searchQuery = req.query ? sanitizeHtml(req.query.q).toLowerCase() : "";
    const filter = req.query.f ? sanitizeHtml(req.query.f).toLowerCase() : "";
    const userId = req.session.user ? req.session.user : null;
    
    if(searchQuery == "") res.redirect("/");

    let playlists = [];
    let profiles = [];
    let tracks = [];

    const substringSearch = { [Op.substring]: `${searchQuery}` }

    const titleQuery = filter === "" || filter.match("tr")  ? substringSearch : null;
    const genresQuery = filter === "" || filter.match("gn") ? substringSearch : null;
    const artistsQuery = filter === "" || filter.match("art") ? substringSearch : null;
    
    if(titleQuery || genresQuery || artistsQuery){
        console.log(titleQuery, genresQuery, artistsQuery)
        tracks = await Track.findAll({
            where: {
                [Op.or]:{ 
                    title: titleQuery,
                    genres: genresQuery,
                    artists: artistsQuery
                },
            },
            raw: true,
        }).catch((err) => {
            if(err) console.log(err);
        });

        tracks = await appendTracksMeta(userId, tracks);
    };
    
    if(filter === "" || filter.match("pl")){
        playlists = await Playlist.findAll({
            where: {
                title: substringSearch,
            },
            raw: true,
        }).catch((err) => {
            if(err) console.log(err);
        });

        playlists = await appendPlaylistsMeta(userId, playlists);
    };
    
    if(filter === "" || filter.match("pr")){
        profiles = await User.findAll({
            where: {
                username: substringSearch,
            },
            attributes: ['id', 'username', 'avatar_url'],
        }).catch((err) => {
            if(err) console.log(err);
        });
    };

    console.log(tracks, 
        playlists, 
        profiles);

    if(searchQuery) res.render('home-page', {
        tracks, 
        playlists, 
        profiles, 
        search: true, 
        loggedIn: await isLoggedIn(req)
    });
};