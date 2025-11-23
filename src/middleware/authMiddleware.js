module.exports.isAuthed = async (req, res, next) => {
    if(req.session.user) next();
    else res.redirect("/login");
};

module.exports.isLoggedIn = async (req) => {
    return req.session.user ? true : false;
};