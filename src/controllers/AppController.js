const sequelize = require("sequelize");
const {Op} = require ("sequelize");

const [ Playlist ] = require("../models/PlaylistModel");
const Track = require("../models/TrackModel");
const User = require("../models/UserModel");
const { isLoggedIn } = require("../middleware/authMiddleware");
const { getLikedTracks, getSavedPlaylists } = require("../controllers/CatalogueController");

module.exports.hubPage = async (req, res) => {
    const tracks = await Track.findAll({
        raw: true,
        order: sequelize.col('likes'),
        limit: 10,
    });

    const playlists = await Playlist.findAll({
        raw: true,
        limit: 10,
    });

    const profiles = await User.findAll({
        raw: true,
        limit: 10,
    })

    const query = {
        where: {
            user_id: {
                [Op.eq]: req.session.user,
            },
        },
        raw: true
    }

    const likedTracks = await getLikedTracks(query);
    const savedPlaylists = await getSavedPlaylists(query);

    tracks.map((track) => {
        track.isLiked = false;
        for(let likedTrack of likedTracks){
            if(likedTrack.id !== track.id) continue;

            track.isLiked = true;
            break;
        }
        track.isOwner = track.owner_id === req.session.user ? true : false;
    });

    playlists.map((playlist) => {
        playlist.isSaved = false;
        for(let savedPlaylist of savedPlaylists){
            if(savedPlaylist.id !== playlist.id) continue;

            playlist.isSaved = true;
            break;
        }
        playlist.isOwner = playlist.owner_id === req.session.user ? true : false;
    });

    res.render('home-page', { tracks, playlists, profiles, search: false, loggedIn: await isLoggedIn(req)});
}; 