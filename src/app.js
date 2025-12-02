const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const {uuidv7} = require("uuidv7");
const sessionStore = require("./db/sessions_storage");
const node_process = require('node:process');
node_process.loadEnvFile("./config/.env");

const app = express();

const userRouter = require("./routes/user_routes");
const playlistRouter = require("./routes/playlist_routes");
const trackRouter = require("./routes/track_routes");
const catalogueRouter = require("./routes/catalogue_routes");
const AppController = require("./controllers/AppController");
const {search} = require("./middleware/searchMiddlewere");
const { isLoggedIn } = require("./middleware/authMiddleware");

app.use(bodyParser.json());
app.use(express.urlencoded());
app.set('view engine', 'ejs');
app.set('views', './src/views');

app.use(session({
    genid: function(req) {
        return uuidv7(); // use UUIDs for session IDs
    },
	name: 'cw_rythm_flow_cookie',
	secret: process.env.SESSION_SECRET,
	store: sessionStore,
	resave: false,
	saveUninitialized: true,
    cookie: { 
		path: '/', 
		httpOnly: true, 
		secure: false, 
		maxAge: 1080000,
	},
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
app.use('/public/style/', express.static(process.env.rootFiles + '/public/style'));
app.use('/public/scripts/', express.static(process.env.rootFiles + '/public/scripts'));

app.get("/", AppController.hubPage);
app.get("/search", search)

app.use((error, req, res, next) => {
	switch(error.status){
		case 404: res.render("404-page", { loggedIn: isLoggedIn(req) }); break;
		case 403: res.render("403-page", { loggedIn: false }); break;
		default: console.log(error.message);
	}
});

module.exports = app;