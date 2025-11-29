const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/audio");
  },
  filename: function (req, file, cb) {
    cb(null, req.body.title + "-" + Date.now() + file.originalname.match(/.mp3/));
  },
});

const upload = multer({ storage: storage });

module.exports = upload;