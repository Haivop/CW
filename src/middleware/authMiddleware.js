module.exports.isAuthed = async (req, res, next) => {
    if(!req.session.user) res.redirect("/login");
    else next();
};

module.exports.isLoggedIn = async (req) => {
    return req.session.user ? true : false;
};