const User = require("../models/UserModel");
const sequelize = require("../db/connection");
const {Op} = require("sequelize");

await sequelize.sync()

module.exports.loginPage = async (req, res) => {
    res.render('login-page');
};

module.exports.login = async (req, res, next) => {
    req.session.regenerate(function(err){
        if(err) next(err);

        const user = User.findOne({
            where:{
                username:{
                    [Op.eq]: req.body.username,
                },
                password:{
                    [Op.eq]: req.body.password,
                },
            },
            raw: true
        });

        if(user == []){
            const error = new Error("no such user!");
            error.status = 404;
            next(error);
        };
        
        req.session.user = user.id;

        req.session.save(function(err){
            if(err) next(err);
            res.redirect("/");
        });
    })
};




