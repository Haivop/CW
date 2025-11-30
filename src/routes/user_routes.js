const express = require("express");
const user = express.Router();

const imagesUpload = require("../db/images_storage");
const UserController = require("../controllers/UserController");
const { isAuthed } = require("../middleware/authMiddleware");

user.get("/login", UserController.loginPage);
user.post("/login", UserController.login);
user.delete("/login", UserController.logOut);

user.get("/sign-up", UserController.signUpPage);
user.post("/sign-up", UserController.signUp);

user.get("/account", isAuthed, UserController.accountPage);
user.post("/account", isAuthed, imagesUpload.single('avatar'), UserController.editAccount);

user.get("/profiles/:profileId", UserController.profilePage);
user.delete("/profiles/:profileId", UserController.deleteUser);

module.exports = user;