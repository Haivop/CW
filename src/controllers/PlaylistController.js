const sanitizeHtml = require('sanitize-html');
const {Op} = require ("sequelize");

const sequelize = require("../db/sequelize_connection");
const [ Playlist ] = require("../models/PlaylistModel");
const [ , PlaylistCatalogue ] = require("../models/CataloguesModel");

const {isLoggedIn} = require("../middleware/authMiddleware");

const { getLikedTracks } = require("../controllers/CatalogueController");

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

    tracks.map((track) => {
        track.isLiked = likedTracks.includes(track);
    })

    res.render('playlist-page', {playlist: playlist.toJSON(), tracks, loggedIn: isLoggedIn(req)});
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

deletePlaylistFromCatalogue = async (req, res) => {
    const { playlistId } = req.params;

    if(!req.session.user) return;

    await PlaylistCatalogue.destroy({
        user_id: req.session.user,
        playlist_id: playlistId,
    }).catch((err) => { console.log(err)});

    res.status(200);
};

