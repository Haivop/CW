const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const sessionStore = require("./db/sessions_storage");
const node_process = require('node:process');
node_process.loadEnvFile("./config/.env");

const app = express();

const userRouter = require("./routes/user_routes");
const playlistRouter = require("./routes/playlist_routes");
const trackRouter = require("./routes/track_routes");
const catalogueRouter = require("./routes/catalogue_routes");
const AppController = require("./controllers/AppController");

app.use(bodyParser.json());
app.use(express.urlencoded());
app.set('view engine', 'ejs');
app.set('views', './src/views');

app.use(session({
    genid,
	secret: process.env.SESSION_SECRET,
	store: sessionStore,
	resave: false,
	saveUninitialized: true,
    cookie: {maxAge: 86400000},
}));

sessionStore.onReady().then(() => {
	// MySQL session store ready for use.
	console.log('MySQLStore ready');
}).catch(error => {
	// Something went wrong.
	console.error(error);
});

app.use("/", userRouter);
app.use("/playlists", playlistRouter);
app.use("/tracks", trackRouter);
app.use("/catalogue", catalogueRouter);

app.use('/tracks/public/audio/', express.static(process.env.rootFiles + '/public/audio'));
app.use('/public/images/', express.static(process.env.rootFiles + '/public/images'));


app.get("/", AppController.hubPage);

module.exports = app;