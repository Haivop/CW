const express = require("express");
const CatalogController = require("../controllers/CatalogueController");
const catalogue = express.Router();

catalogue.get("/", CatalogController.catalogPage);

module.exports = catalogue;