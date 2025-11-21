const express = require("express");
const catalogue = express.Router();

catalogue.get("/catalogue", (req, res) => { res.send("your catalogue")});

module.exports = catalogue;