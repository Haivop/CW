const Catalogue = require("../models/TrackCotalogueModel");
const sequelize = require("../db/connection");

await sequelize.sync()