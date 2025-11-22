module.exports.isAuthed = async (req, res, next) => {
    if(req.session.user) next();
    else res.redirect("/login");
}