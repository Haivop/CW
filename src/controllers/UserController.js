const { Op, QueryTypes } = require("sequelize");
const crypto = require('crypto');
const sanitizeHtml = require('sanitize-html');

const sequelize = require("../db/sequelize_connection");
const User = require("../models/UserModel");
const { isLoggedIn } = require("../middleware/authMiddleware");
const { getCataloguesOfUser } = require("../controllers/CatalogueController");
const { mergePatch } = require("../middleware/utility");


module.exports.loginPage = async (req, res) => {
    res.render('login-page');
};

module.exports.login = async (req, res, next) => {
    req.session.regenerate(async function(err){
        if(err) next(err);

        const user = await User.findOne({
            where:{
                username:{
                    [Op.eq]: sanitizeHtml(req.body.username),
                },
            },
            raw: true,
        });

        if(!user || user === null){
            const error = new Error("No such user!");
            error.status = 403;
            next(error);
            return;
        };

        if(user.password !== hashPassword(req.body.password, user.password_salt)){
            const error = new Error("Invalid password!");
            error.status = 403;
            next(error);
        };

        req.session.user = user.id;

        req.session.save(function(err){
            if(err) next(err);
            res.redirect("/");
        });
    })
};


module.exports.accountPage = async (req, res) => {
    const user = await User.findByPk(req.session.user);

    let likedTracks = await sequelize.query({
        query: `SELECT t.* 
                FROM Tracks t 
                JOIN Liked_Catalogues lc ON t.id = lc.track_id 
                WHERE lc.user_id = ?
                ORDER BY t.likes DESC`, 
        values: [req.session.user]
    },
    {
        type: QueryTypes.SELECT,
        raw: true,
    }); 

    for(let track of likedTracks){
        track.artists = track.artists.split(/\s*[,;]\s*/);
        track.genres = track.genres.split(/\s*[,;]\s*/);
    }

    const artist_chart = new Map();
    const genre_chart = new Map();

    for(let liked_track of likedTracks){
        const {artists, genres} = liked_track;

        for(let artist of artists) artist_chart.set(artist, (artist_chart.get(artist) || 0) + 1);
        for(let genre of genres) genre_chart.set(genre, (genre_chart.get(genre) || 0) + 1);
    }

    console.log(artist_chart, genre_chart);

    const top5Tracks = likedTracks.splice(0, 5);
    const top5Artists = await makeTop5Chart(artist_chart);
    const top5Genres = await makeTop5Chart(genre_chart);

    console.log(top5Artists, top5Genres);

    res.render('account-page', { user, top5Tracks, top5Artists, top5Genres, loggedIn: true});
};

async function makeTop5Chart (chart){
    return new Map([...chart.entries()].sort((e1, e2) => e1[0] - e2[0]).splice(0, 5))
};


module.exports.signUpPage = async (req, res) => {
    res.render('sign-up-page');
};


module.exports.signUp = async (req, res) => {
    const SALT_LENGTH = 64;
    const BYTE_TO_STRING_ENCODING = "hex";

    const { username, email, password } = req.body;
    console.log(req.body);

    const salt = crypto
      .randomBytes(SALT_LENGTH)
      .toString(BYTE_TO_STRING_ENCODING);

    const hashedPassword = hashPassword(password, salt);
    
    User.create({
        username: sanitizeHtml(username),
        password: hashedPassword,
        email: sanitizeHtml(email),
        password_salt: salt,
    }).catch(
        (err) => console.log("Error while creating user account" + err)
    ).then(this.login(req, res));
}


function hashPassword(password, salt) {
    const PASSWORD_LENGTH = 256;
    const ITERATIONS = 10000;
    const DIGEST = "sha256";

    return crypto.pbkdf2Sync(password, salt, ITERATIONS, PASSWORD_LENGTH, DIGEST).toString("hex");
}

module.exports.logOut = async(req, res, next) => {
    req.session.user = null;
    req.session.save(function(err) {
        if(err) next(err);

        req.session.regenerate(function(err) {
            if(err) next(err);
            res.status(200).redirect("/")
        });
    });
}

module.exports.profilePage = async(req, res) => {
    const catalogueType = req.query.t == undefined ? "none" : req.query.t;
    const userId = sanitizeHtml(req.params.profileId);
    
    let { 
        uploaded_tracks, 
        created_playlists, 
        saved_playlists, 
        liked_tracks 
    } = await getCataloguesOfUser(userId, catalogueType);
    
    const profile = await User.findByPk(userId, {raw: true});

    console.log(uploaded_tracks);

    uploaded_tracks = uploaded_tracks.filter(track => track.public_flag);
    console.log(uploaded_tracks);

    res.render('profile-page', {
        profile: { 
            username : profile.username, 
            avatar: profile.avatar_url
        },
        uploaded_tracks, 
        created_playlists, 
        saved_playlists, 
        liked_tracks,
        catalogueType,
        loggedIn : await isLoggedIn(req),
    });
};

module.exports.editAccount = async (req, res) => {
    const userId = req.session.user;

    let originalUserData = await User.findByPk(userId);
    let newUserData = req.body;

    console.log(req.body);

    newUserData.avatar_url = req.file !== undefined ? req.file.path : null;

    originalUserData = await mergePatch(newUserData, originalUserData);
    originalUserData.save();

    res.redirect(req.originalUrl);
};

module.exports.deleteUser = async (req, res) => {
    const profileId = sanitizeHtml(req.params.profileId);
    const user = await User.findByPk(profileId);

    user.destroy();

    res.end();
};




