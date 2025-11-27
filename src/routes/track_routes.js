const express = require("express");
const TrackController = require("../controllers/TrackController");
const audioUpload = require("../db/audio_storage");
const { isAuthed } = require("../middleware/authMiddleware");

const track = express.Router();

track.get("/upload", isAuthed, TrackController.uploadPage);
track.post("/upload", isAuthed, audioUpload.single('audio_file'), TrackController.uploadTrack);

track.get("/:trackId", TrackController.trackPage);
track.post("/:trackId", TrackController.addTrackToPlaylists);
track.patch("/:trackId", TrackController.like);

module.exports = track;