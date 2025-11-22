const express = require("express");
const CatalogController = require("../controllers/CatalogueController");
const catalogue = express.Router();
const { isAuthed } = require("../middleware/authMiddleware");

catalogue.get("/", isAuthed, CatalogController.catalogPage);

module.exports = catalogue;