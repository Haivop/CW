const express = require("express");
const user = express.Router();
const UserController = require("../controllers/UserController");
const { isAuthed } = require("../middleware/authMiddleware");

user.get("/login", UserController.loginPage);
user.post("/login", UserController.login);
user.delete("/login", UserController.logOut);

user.get("/sign-up", UserController.signUpPage);
user.post("/sign-up", UserController.signUp);

user.get("/account", isAuthed, UserController.accountPage);
user.patch("/account", isAuthed, (req, res) => { res.send("your account changed")})

user.get("/profiles/:profileId", (req, res) => { res.send ("profile page")})

module.exports = user;