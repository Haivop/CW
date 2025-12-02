const sequelize = require("sequelize");
const {Op} = require ("sequelize");

const [ Playlist ] = require("../models/PlaylistModel");
const Track = require("../models/TrackModel");
const User = require("../models/UserModel");
const { isLoggedIn } = require("../middleware/authMiddleware");
const { appendTracksMeta, appendPlaylistsMeta } = require("../middleware/utility");


module.exports.hubPage = async (req, res) => {
    let tracks = await Track.findAll({
        where: {
            public_flag: true,
        },
        raw: true,
        order: sequelize.col('likes'),
        limit: 10,
    });

    let playlists = await Playlist.findAll({
        raw: true,
        limit: 10,
    });

    const profiles = await User.findAll({
        raw: true,
        limit: 10,
    })

    tracks = await appendTracksMeta(req.session.user, tracks);
    playlists = await appendPlaylistsMeta(req.session.user, playlists);

    res.render('home-page', { tracks, playlists, profiles, search: false, loggedIn: await isLoggedIn(req)});
}; 