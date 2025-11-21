const Track = require("../models/TrackModel");
const sequelize = require("../db/connection");

await sequelize.sync()