const express = require("express");
const TrackController = require("../controllers/TrackController");
const audioUpload = require("../db/audio_storage");
const imageUpload = require("../db/images_storage");
const trackUpload = require("../db/track_files_storage");
const { isAuthed } = require("../middleware/authMiddleware");

const track = express.Router();

track.get("/upload", isAuthed, TrackController.uploadPage);
track.post("/upload", isAuthed, trackUpload.fields([
    { name: "audio_file", maxCount: 1 },
    { name: "image_file", maxCount: 1 },
  ]), TrackController.uploadTrack);

track.get("/:trackId", TrackController.trackPage);
track.put("/:trackId", imageUpload.single('image'), TrackController.editTrack);
track.post("/:trackId", TrackController.addTrackToPlaylists);
track.patch("/:trackId", TrackController.like);
track.delete("/:trackId", TrackController.deleteTrack)

track.get("/:trackId/download", isAuthed, TrackController.downloadTrack);

module.exports = track;