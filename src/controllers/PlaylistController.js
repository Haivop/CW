const sanitizeHtml = require('sanitize-html');
const {Op} = require ("sequelize");
const node_process = require('node:process');
node_process.loadEnvFile("./config/.env");
const fs = require('node:fs');
const AdmZip = require('adm-zip');

const sequelize = require("../db/sequelize_connection");
const Playlist = require("../models/PlaylistModel")[0];
const [ , PlaylistCatalogue ] = require("../models/CataloguesModel");

const {isLoggedIn} = require("../middleware/authMiddleware");

const { getLikedTracks } = require("../controllers/CatalogueController");
const { mergePatch, queryUser_PlaylistIdIntersection, queryById, querySaved } = require("../middleware/utility");


module.exports.createPlaylist = async (req, res) => {
    if(!req.session.user) res.status(403).end()

    const path = req.file ? req.file.path : "public\\images\\placeholder\\placeholder.jpeg";
    const title = sanitizeHtml(req.body.title);
    const owner_id = req.session.user;

    await Playlist.create({owner_id, title, image_url: path});

    if(req.session.user) res.redirect('/catalogue');
};

module.exports.deletePlaylist = async (req, res) => {
    if(!req.session.user) res.status(403).end();
    const playlistId = req.params.playlistId;
    
    await Playlist.destroy(queryById(playlistId)).catch((err) => { console.log(err) });

    if(req.originalUrl.match(/\/playlists/)) res.status(204).redirect("/");
    else res.status(204);
};


module.exports.playlistPage = async (req, res) => {
    const playlist = await Playlist.findByPk(req.params.playlistId)
        .catch((err) => { console.log(err) });

    let tracks = await playlist.getTracks({ raw: true });
    const likedTracks = await getLikedTracks(querySaved(req.session.user));

    tracks = tracks.filter(track => track.public_flag);
    tracks.forEach((track) => {
        track.isLiked = likedTracks.some(liked_track => liked_track.id === track.id)
    });

    const isOwner = req.session.user === playlist.owner_id;

    res.render('playlist-page', {playlist: playlist.toJSON(), tracks, loggedIn: await isLoggedIn(req), isOwner});
};


module.exports.downloadPlaylist = async (req, res) => {
    const playlist = await Playlist.findByPk(req.params.playlistId);
    const tracks = await playlist.getTracks({ raw: true });
    const zipper = new AdmZip();

    for(let track of tracks){
        zipper.addLocalFile(process.env.rootFiles + track.audio_url);
    }

    const temp_file_path = process.env.rootFiles + "public\\temp\\download_playlist" + Date.now() + ".zip";
    zipper.writeZip(temp_file_path);

    res.setHeader('Content-type','application/zip');
    res.sendFile(temp_file_path);

    fs.unlinkSync(temp_file_path);
};

module.exports.addPlaylistToCatalogue = async (req, res) => {
    if(!req.session.user) res.status(403).end();

    const playlistId = req.params.playlistId;
    const query = queryUser_PlaylistIdIntersection(req.session.user, playlistId)
    const isAlreadySaved = await PlaylistCatalogue.findOne(query);

    if(isAlreadySaved != null) await deletePlaylistFromCatalogue(req, res);
    else {
        await PlaylistCatalogue.create(query)
            .catch((err) => { console.log(err) });

        if(req.session.user) res.status(200);
    }
};

module.exports.editPlaylist = async (req, res) => {
    const userId = req.session.user;
    const playlistId = sanitizeHtml(req.params.playlistId);
    let playlist = await Playlist.findByPk(playlistId);

    if(playlist.owner_id !== userId) res.status(403).end();

    if(!req.file) delete req.body.image;

    const newPlaylistData = req.body;
    newPlaylistData.image_url = req.file ? req.file.path : null;

    playlist = await mergePatch(newPlaylistData, playlist);
    playlist.save();

    if(playlist.owner_id === userId) res.status(200).end();
};

const deletePlaylistFromCatalogue = async (req, res) => {
    if(!req.session.user) res.status(403).next(new Error("No Access").status = 403);
    
    const playlistId = req.params.playlistId;
    await PlaylistCatalogue.destroy(
        queryUser_PlaylistIdIntersection(req.session.user, playlistId)
    ).catch((err) => { console.log(err)});

    if(req.session.user) res.status(200).redirect(req.originalUrl);
};

