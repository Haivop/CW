const multer = require("multer");

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, "./public/images");
    },
    filename: function(req, file, cb){
        cb(null, file.originalname.replace(/.jpg|.png|.jpeg/, "") + Date.now() + file.originalname.match(/.jpg|.png|.jpeg/));
    },
})

module.exports = multer({ storage });