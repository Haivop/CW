const express = require("express");
const track = express.Router();

track.get("/tracks/:trackId", (req, res) => { res.send("track")});

track.get("/create", (req, res) => { res.send("creation page!")});
track.post("/create", (req, res) => { res.send("track created")});

module.exports = track;