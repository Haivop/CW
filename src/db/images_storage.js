const multer = require("multer");

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, "./public/images");
    },
    filename: function(req, file, cb){
        cb(null, file.originalname + Date.now());
    },
})

const imagesUpload = multer({ storage });

module.exports = imagesUpload;