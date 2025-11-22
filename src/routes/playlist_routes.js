const express = require("express");
const playlist = express.Router();
const PlaylistController = require('../controllers/PlaylistController');
const imagesUpload = require("../db/images_storage");

playlist.post("/", imagesUpload.single('audio'), PlaylistController.createPlaylist);

playlist.get("/:playlistId", PlaylistController.playlistPage);
playlist.patch("/:playlistId", (req, res) => { res.send("your catalogue")});

module.exports = playlist;