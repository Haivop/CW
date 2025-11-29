const express = require("express");
const PlaylistController = require('../controllers/PlaylistController');
const imagesUpload = require("../db/images_storage");
const { isAuthed } = require("../middleware/authMiddleware");

const playlist = express.Router();

playlist.post("/", isAuthed, imagesUpload.single('image'), PlaylistController.createPlaylist);

playlist.get("/:playlistId", PlaylistController.playlistPage);
playlist.post("/:playlistId", isAuthed, PlaylistController.addPlaylistToCatalogue);
playlist.put("/:playlistId", isAuthed, imagesUpload.single('image'), PlaylistController.editPlaylist);
playlist.delete("/:playlistId", isAuthed, PlaylistController.deletePlaylist);

playlist.get("/:playlistId/download", isAuthed, PlaylistController.downloadPlaylist);

module.exports = playlist;