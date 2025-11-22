const express = require("express");
const TrackController = require("../controllers/TrackController");
const audioUpload = require("../db/audio_storage");

const track = express.Router();
track.use(express.static('public'));

track.get("/upload", TrackController.uploadPage);
track.post("/upload", audioUpload.single('audio_file'), TrackController.uploadTrack);

track.get("/:trackId", TrackController.trackPage);

module.exports = track;