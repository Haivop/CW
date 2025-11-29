const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.mimetype.startsWith("image/")) {
      cb(null, "./public/images");
    } else if (file.mimetype === "audio/mpeg") {
      cb(null, "./public/audio");
    } else {
      cb(new Error("Unsupported file type"), null);
    }
  },

  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname); // .jpg/.jpeg/.png/.mp3
    const base = path.basename(file.originalname, ext);

    if (file.mimetype.startsWith("image/")) {
      cb(null, `${base}-${Date.now()}${ext}`);
    } else if (file.mimetype === "audio/mpeg") {
      const safeTitle = req.body.title?.replace(/[^a-zA-Z0-9_-]/g, "_") || "track";
      cb(null, `${safeTitle}-${Date.now()}${ext}`);
    } else {
      cb(new Error("Unsupported file type"), null);
    }
  }
});

module.exports = multer({ storage });