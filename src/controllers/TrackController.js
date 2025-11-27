const {Op} = require("sequelize");
const sanitizeHtml = require('sanitize-html');

const [ Playlist ] = require("../models/PlaylistModel");
const Track = require("../models/TrackModel");
const User = require("../models/UserModel");
const [ LikedTracksCatalogue, PlaylistCatalogue] = require("../models/CataloguesModel");

const sequelize = require("../db/sequelize_connection");

const { isLoggedIn } = require("../middleware/authMiddleware");

const { getSavedPlaylists } = require("../controllers/CatalogueController");

module.exports.uploadPage = async (req, res) => {
    const loggedIn = req.session.user ? true : false;
    res.render('upload-page', {loggedIn});
};

module.exports.uploadTrack = async (req, res) => {
    for(let key of Object.keys(req.body)) req.body[key] = sanitizeHtml(req.body[key]);

    const {title, genre, artists} = req.body;
    const path = req.file ? req.file.path : "public\\images\\placeholder\\placeholder.jpeg";
    const owner_id = req.session.user;

    await Track.create({owner_id, title, artists, genre, audio_url: path});

    res.redirect("/");
};

module.exports.trackPage = async (req, res) => {
    const trackId = req.params.trackId;

    const track = await Track.findByPk(trackId);
    const createdPlaylists = await Playlist.findAll({
        where: {
            owner_id: {
                [Op.eq]: req.session.user,
            },
        },
        raw: true,
    });

    const savedPlaylists = await getSavedPlaylists({
        where: {
            user_id: {
                [Op.eq]: req.session.user,
            },
        },
        raw: true,
    });

    const cataloguePlaylists = createdPlaylists.concat(savedPlaylists);
    const playlistsContainingTrack = await track.getPlaylists({raw: true});
    
    playlistsContainingTrack.map((playlist) => {
        playlist.isSaved = cataloguePlaylists.includes(playlist);
    })

    const userId = req.session ? req.session.user : null;
    const isLiked = await checkIsLiked(userId, trackId);

    res.render('track-page', {track, cataloguePlaylists, playlistsContainingTrack, loggedIn: await isLoggedIn(req), isLiked});
};

module.exports.addTrackToPlaylists = async (req, res) => {
    let playlistsIds_Array = [];
    if(!Array.isArray(req.body.playlists)) playlistsIds_Array.push(req.body.playlists);
    else playlistsIds_Array = req.body.playlists

    const track_SqlizeObject = await Track.findByPk(req.params.trackId);
    const playlistsContainingTrack = await track_SqlizeObject.getPlaylists();

    for(let playlist of playlistsContainingTrack){
        if(playlistsIds_Array.includes(playlist.getDataValue("id"))) await track_SqlizeObject.removePlaylist(playlist);
        playlistsIds_Array = playlistsIds_Array.filter((id) => {
            return id === playlist.getDataValue("id") ? false : true;
        });
    };

    for(let uuid of playlistsIds_Array){
        const playlist_SqlizeObject = await Playlist.findByPk(uuid);
        await track_SqlizeObject.addPlaylist(playlist_SqlizeObject);
    };

    this.trackPage(req, res);
}

module.exports.like = async (req, res) => {
    //console.log(req.params, req.session);
    if(req.session == undefined) return;

    const user = await User.findByPk(req.session.user);
    const track = await Track.findByPk(req.params.trackId);

    //console.log(user.id, track.id, await checkIsLiked(user.id, track.id));

    const currentLikes = await track.getDataValue("likes");
    if (await checkIsLiked(user.id, track.id)){
        LikedTracksCatalogue.destroy({
            where: {
                user_id: user.id, 
                track_id: track.id,
            },
        });
        track.setDataValue("likes", currentLikes - 1);
    } else {
        LikedTracksCatalogue.create({
            user_id: user.id, 
            track_id: track.id
        });
        track.setDataValue("likes", currentLikes + 1);
    }

    //console.log(currentLikes);
    track.save();

    //console.log(track);
    this.trackPage(req, res);
}

async function checkIsLiked (userId, trackId) {
    const user_like = userId != null ? await LikedTracksCatalogue.findOne({
        where: {
            user_id: userId,
            track_id: trackId,
        }
    }) : null;

    return isLiked = user_like != null ? true : false;
}
