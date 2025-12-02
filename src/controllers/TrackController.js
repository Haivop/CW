const {Op} = require("sequelize");
const sanitizeHtml = require('sanitize-html');
const node_process = require('node:process');
node_process.loadEnvFile("./config/.env");

const [ Playlist ] = require("../models/PlaylistModel");
const Track = require("../models/TrackModel");
const User = require("../models/UserModel");
const [ LikedTracksCatalogue, PlaylistCatalogue] = require("../models/CataloguesModel");

const sequelize = require("../db/sequelize_connection");

const { isLoggedIn } = require("../middleware/authMiddleware");
const { getSavedPlaylists } = require("../controllers/CatalogueController");
const { mergePatch, queryOwned, querySaved, appendPlaylistsMeta, queryUser_TrackIdIntersection } = require("../middleware/utility");

module.exports.uploadPage = async (req, res) => {
    res.render('upload-page', {loggedIn: true});
};

module.exports.uploadTrack = async (req, res) => {
    for(let key of Object.keys(req.body)) {
        req.body[key] = sanitizeHtml(req.body[key]);
    }

    const {title, genres, artists} = req.body;

    const image = req.files.image_file.pop();
    const audio = req.files.audio_file.pop();
    
    const imagePath = image ? image.path : "public\\images\\placeholder\\placeholder.jpeg";
    const audioPath = audio.path;
    const owner_id = req.session.user;

    await Track.create({owner_id, title, artists, genres, audio_url: audioPath, image_url: imagePath});

    res.redirect("/");
};

module.exports.downloadTrack = async (req, res) => {
    const trackId = sanitizeHtml(req.params.trackId);
    const track = await Track.findByPk(trackId, {raw: true});

    res.download(process.env.rootFiles.concat(track.audio_url));
};

module.exports.trackPage = async (req, res) => {
    const trackId = req.params.trackId;

    const track = await Track.findByPk(trackId);
    if(track.public_flag !== true) res.redirect("/");

    const userId = req.session ? req.session.user : null;

    const createdPlaylists = await Playlist.findAll(queryOwned(userId))
        .catch((err) => {
            if(err) console.log(err);
        });
    const savedPlaylists = await getSavedPlaylists(querySaved(userId))
        .catch((err) => {
                if(err) console.log(err);
            });

    const cataloguePlaylists = createdPlaylists.concat(savedPlaylists);

    let playlistsContainingTrack = await track.getPlaylists({raw: true});
    playlistsContainingTrack = await appendPlaylistsMeta(userId, playlistsContainingTrack);

    const isLiked = await checkIsLiked(userId, trackId);
    const isOwner = track.owner_id === userId;

    if(track.public_flag === true) 
        res.render('track-page', {
            track, 
            cataloguePlaylists, 
            playlistsContainingTrack, 
            loggedIn: await isLoggedIn(req), 
            isLiked,
            isOwner,
        });
};

module.exports.addTrackToPlaylists = async (req, res) => {
    let playlistsIds_Array = [];
    if(!Array.isArray(req.body.playlists)) playlistsIds_Array.push(req.body.playlists);
    else playlistsIds_Array = req.body.playlists

    console.log(playlistsIds_Array);

    const track_SqlizeObject = await Track.findByPk(req.params.trackId);
    const playlistsContainingTrack = await track_SqlizeObject.getPlaylists();
    console.log(playlistsContainingTrack);

    for(let playlist of playlistsContainingTrack){
        if(!playlistsIds_Array.includes(playlist.getDataValue("id"))) continue;
        
        await track_SqlizeObject.removePlaylist(playlist);
        playlistsIds_Array = playlistsIds_Array.filter(id => id !== playlist.getDataValue("id"));
    };

    for(let uuid of playlistsIds_Array){
        const playlist_SqlizeObject = await Playlist.findByPk(uuid);
        await track_SqlizeObject.addPlaylist(playlist_SqlizeObject);
    };

    if(track_SqlizeObject.owner_id === req.session.user) res.redirect(req.originalUrl);
}

module.exports.like = async (req, res, next) => {
    const user = await User.findByPk(req.session.user);
    const track = await Track.findByPk(req.params.trackId);

    const currentLikes = await track.getDataValue("likes");
    if (await checkIsLiked(user.id, track.id)){
        LikedTracksCatalogue.destroy(queryUser_TrackIdIntersection(user.id, track.id));
        track.setDataValue("likes", currentLikes - 1);
    } else {
        LikedTracksCatalogue.create({
            user_id: user.id, 
            track_id: track.id
        });
        track.setDataValue("likes", currentLikes + 1);
    }

    track.save();
    this.trackPage(req, res);
}

async function checkIsLiked (userId, trackId) {
    const user_like = userId != null ? await LikedTracksCatalogue.findOne(queryUser_TrackIdIntersection(userId, trackId)) : null;

    return user_like != null;
}

module.exports.deleteTrack = async (req, res) => {
    if(!req.session.user) res.status(403).end();
    const trackId = sanitizeHtml(req.params.trackId);

    const track = await Track.findByPk(trackId);
    await track.destroy();
    if(req.session.user) res.status(204).end();
}

module.exports.editTrack = async (req, res) => {
    const userId = req.session.user;
    const trackId = sanitizeHtml(req.params.trackId);

    let track = await Track.findByPk(trackId);
    if(track.owner_id !== userId) res.status(403).end();

    if(!req.file) delete req.body.image;
    const newTrackData = req.body;
    newTrackData.image_url = req.file ? req.file.path : null;

    console.log(newTrackData);
    
    track = await mergePatch(newTrackData, track)
        .catch((err) => {
            if(err) console.log(err)
        });

    track.save();
    if(track.owner_id === userId) res.status(200).end();
};