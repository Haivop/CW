const Playlist = require("../models/PlaylistModel");
const sequelize = require("../db/connection");

await sequelize.sync()