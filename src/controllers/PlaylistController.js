const sanitizeHtml = require('sanitize-html');
const {Op} = require ("sequelize");
const node_process = require('node:process');
node_process.loadEnvFile("./config/.env");
const zip = require('adm-zip');
const fs = require('node:fs');
const AdmZip = require('adm-zip');

const sequelize = require("../db/sequelize_connection");
const [ Playlist ] = require("../models/PlaylistModel");
const [ , PlaylistCatalogue ] = require("../models/CataloguesModel");

const {isLoggedIn} = require("../middleware/authMiddleware");

const { getLikedTracks } = require("../controllers/CatalogueController");
const { mergePatch } = require("../middleware/utility");


module.exports.createPlaylist = async (req, res) => {
    const path = req.file ? req.file.path : "public\\images\\placeholder\\placeholder.jpeg";

    if(!req.body.title) throw new Error("null title");
    const title = sanitizeHtml(req.body.title);

    const owner_id = req.session.user;

    console.log(owner_id, title, path);

    await Playlist.create({owner_id, title, image_url: path});

    res.redirect('/catalogue');
};

module.exports.deletePlaylist = async (req, res) => {
    const { playlistId } = req.params;
    if(!req.session.user) return;

    await Playlist.destroy({
        where: {
            id: {
                [Op.eq]: playlistId,
            },
        }
    }).catch((err) => { console.log(err) });

    if(req.originalUrl.match(/\/playlists/)) res.status(204).redirect("/");
    else res.status(204);
};


module.exports.playlistPage = async (req, res) => {
    const playlist = await Playlist.findByPk(req.params.playlistId);

    const tracks = await playlist.getTracks({ raw: true });
    const likedTracks = await getLikedTracks({
        where: {
            user_id: {
                [Op.eq]: req.session.user,
            },
        },
        raw: true
    });

    tracks = tracks.filter(track => track.public_flag === true );
    tracks = tracks.map((track) => { track.isLiked = likedTracks.includes(track) });

    const isOwner = req.session.user === playlist.owner_id;

    console.log(isOwner);

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
    const { playlistId } = req.params;
    if(!req.session.user) return;

    const isAlreadySaved = await PlaylistCatalogue.findOne({
        where: {
            user_id: {
                [Op.eq]: req.session.user,
            },
            playlist_id: {
                [Op.eq]: playlistId,
            },
        }
    });

    if(isAlreadySaved != null) deletePlaylistFromCatalogue(req, res);
    else {
        await PlaylistCatalogue.create({
            user_id: req.session.user,
            playlist_id: playlistId,
        }).catch((err) => { console.log(err) });

        res.status(200);
    }
};

module.exports.editPlaylist = async (req, res) => {
    const userId = req.session.user;
    const playlistId = sanitizeHtml(req.params.playlistId);
    let playlist = await Playlist.findByPk(playlistId);

    if(playlist.owner_id !== userId) res.end();

    if(!req.file) delete req.body.image;

    const newPlaylistData = req.body;
    newPlaylistData.image_url = req.file ? req.file.path : null;

    playlist = await mergePatch(newPlaylistData, playlist);
    playlist.save();

    if(playlist.owner_id === userId) res.end();
};

const deletePlaylistFromCatalogue = async (req, res) => {
    const { playlistId } = req.params;

    if(!req.session.user) return;

    await PlaylistCatalogue.destroy({
        user_id: req.session.user,
        playlist_id: playlistId,
    }).catch((err) => { console.log(err)});

    res.status(200);
};

