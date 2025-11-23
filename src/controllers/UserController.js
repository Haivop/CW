const User = require("../models/UserModel");
const sequelize = require("../db/sequelize_connection");
const {Op} = require("sequelize");
const sanitizeHtml = require('sanitize-html');

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
                password:{
                    [Op.eq]: sanitizeHtml(req.body.password),
                },
            },
            raw: true
        });

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






