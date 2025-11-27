const {Op} = require("sequelize");
const { error } = require("console");
const crypto = require('crypto');
const sanitizeHtml = require('sanitize-html');


const sequelize = require("../db/sequelize_connection");
const User = require("../models/UserModel");


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
            raw: true
        });

        if(user.password !== hashPassword(req.body.password, user.password_salt)){
            const error = new Error("Invalid password!");
            error.status = 403;
            next(error);
        };

        if(user == [] || !user || user == null){
            const error = new Error("no such user!");
            error.status = 404;
            next(error);
        };
        
        req.session.user = user.id;

        req.session.save(function(err){
            if(err) next(err);
            res.redirect('/');
        });
    })
};


module.exports.accountPage = async (req, res) => {
    const user = await User.findByPk(req.session.user);
    console.log(req.session, user);
    res.render('account-page', { user, loggedIn: true});
};


module.exports.signUpPage = async (req, res) => {
    res.render('sign-up-page');
};


module.exports.signUp = async (req, res) => {
    const SALT_LENGTH = 64;
    const BYTE_TO_STRING_ENCODING = "hex";

    const { username, email, password } = req.body;

    const salt = crypto
      .randomBytes(SALT_LENGTH)
      .toString(BYTE_TO_STRING_ENCODING);

    const hashedPassword = hashPassword(password, salt);
    console.log(hashedPassword, "/n", salt);
    
    User.create({
        username: sanitizeHtml(username),
        password: hashedPassword,
        email: sanitizeHtml(email),
        password_salt: salt,
    })
    .then( res.redirect("/") )
    .catch((err) => { console.error("Error while creating user account" + err) });
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






