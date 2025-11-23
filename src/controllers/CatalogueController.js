const {Op} = require ("sequelize");
const sequelize = require("../db/sequelize_connection");
const [ Playlist ] = require("../models/PlaylistModel");
const Track = require("../models/TrackModel");

module.exports.catalogPage = async (req, res) => {
    req.user_id = 'b56cf590-c6c1-11f0-b81e-1122d3e5ee76';

    let catalogType;

    if(req.query != undefined) catalogType = req.query.type;

    console.log(req.query.type);

    const uploaded_tracks = await Track.findAll({
        where: {
            owner_id: {
                [Op.eq]: req.user_id,
            },
        },
        raw: true,
    });
    
    const created_playlists = await Playlist.findAll({
        where: {
            owner_id: {
                [Op.eq]: req.user_id,
            },
        },
        raw: true,
    });

    res.render("catalogue-page", {uploaded_tracks, created_playlists, loggedIn: true});
};