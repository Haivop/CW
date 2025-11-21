const express = require("express");
const bodyParser = require("body-parser");
const app = express();

const userRouter = require("./routes/user_routes");
const playlistRouter = require("./routes/playlist_routes");
const trackRouter = require("./routes/track_routes");
const catalogueRouter = require("./routes/catalogue_routes");

app.use(bodyParser.json());
app.use(express.urlencoded());
app.set('view engine', 'ejs');

app.use("/", userRouter);
app.use("/playlists", playlistRouter);
app.use("/tracks", trackRouter);
app.use("/catalogue", catalogueRouter);

app.get("/", (req, res) => {});

module.exports = app;