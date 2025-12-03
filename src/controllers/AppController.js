const sequelize = require("sequelize");
const {Op} = require ("sequelize");

const [ Playlist ] = require("../models/PlaylistModel");
const Track = require("../models/TrackModel");
const User = require("../models/UserModel");
const { isLoggedIn } = require("../middleware/authMiddleware");
const { appendTracksMeta, appendPlaylistsMeta } = require("../middleware/utility");


module.exports.hubPage = async (req, res) => {
    const limitStart = 0;
    const limitEnd = 10;

    let tracks = await Track.findAll({
        where: {
            public_flag: true,
        },
        raw: true
    });
    let playlists = await Playlist.findAll({raw: true});
    let profiles = await User.findAll({raw: true});

    tracks = tracks.sort(() => Math.random() - 0.5).slice(limitStart, limitEnd);
    playlists = playlists.sort(() => Math.random() - 0.5).slice(limitStart, limitEnd);
    profiles = profiles.sort(() => Math.random() - 0.5).slice(limitStart, limitEnd);

    tracks = await appendTracksMeta(req.session.user, tracks);
    playlists = await appendPlaylistsMeta(req.session.user, playlists);

    res.render('home-page', { tracks, playlists, profiles, search: false, loggedIn: await isLoggedIn(req)});
}; 