const express = require("express");
const PlaylistController = require('../controllers/PlaylistController');
const imagesUpload = require("../db/images_storage");
const { isAuthed } = require("../middleware/authMiddleware");

const playlist = express.Router();

playlist.post("/", isAuthed, imagesUpload.single('audio'), PlaylistController.createPlaylist);

playlist.get("/:playlistId", PlaylistController.playlistPage);
playlist.post("/:playlistId", PlaylistController.addPlaylistToCatalogue);
playlist.patch("/:playlistId", (req, res) => { res.send("your catalogue")});
playlist.delete("/:playlistId", PlaylistController.deletePlaylist);

module.exports = playlist;