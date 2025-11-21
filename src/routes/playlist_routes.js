const express = require("express");
const playlist = express.Router();

playlist.get("/playlists/:playlistId", (req, res) => { res.send("your catalogue")});

module.exports = playlist;