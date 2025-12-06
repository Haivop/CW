const sanitizeHtml = require('sanitize-html');
const {Op} = require ("sequelize");
const node_process = require('node:process');
node_process.loadEnvFile("./config/.env");
const fs = require('node:fs');
const AdmZip = require('adm-zip');
const path = require("path");

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
    else res.status(204).end();
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
    if (!playlist) return res.status(404).send("Playlist not found");
    const tracks = await playlist.getTracks({ raw: true });
    const zipper = new AdmZip();

    for(let track of tracks){
        const filePath = path.join(process.env.rootFiles, track.audio_url);

        if (fs.existsSync(filePath)) {
            zipper.addLocalFile(filePath);
        }
    }

    const tempFilePath = path.join(
        process.env.rootFiles,
        "public",
        "temp",
        `download_playlist_${Date.now()}.zip`
    );

    console.log(tempFilePath, zipper);
    zipper.writeZip(tempFilePath);

    res.setHeader('Content-type','application/zip');
    res.sendFile(tempFilePath, (err) => {
        try {
            if (fs.existsSync(tempFilePath)) {
                fs.unlinkSync(tempFilePath);
            }
        } catch (e) {
            console.error("Failed to delete temp file:", e);
        }

        if (err) {
            console.error("Error sending zip:", err);
        }
    });
};


module.exports.addPlaylistToCatalogue = async (req, res) => {
    if(!req.session.user) res.status(403).end();

    const playlistId = req.params.playlistId;
    if(!(playlistId || req.session.user)){
        const error = new Error("No such playlist found");
        error.status = 404;
        next(error);
    }
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

const deletePlaylistFromCatalogue = async (req, res, next) => {
    if(!req.session.user) res.status(403).next(new Error("No Access").status = 403);
    
    const playlistId = req.params.playlistId;
    await PlaylistCatalogue.destroy(
        queryUser_PlaylistIdIntersection(req.session.user, playlistId)
    ).catch((err) => { console.log(err)});

    if(req.session.user) res.status(200).end();
};

