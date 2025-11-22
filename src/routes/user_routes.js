const express = require("express");
const user = express.Router();
const UserController = require("../controllers/UserController");

user.get("/login", UserController.loginPage);
user.post("/login", UserController.login);

user.get("/sign-up", (req, res) => { res.send("sign-up page")});
user.post("/sign-up", (req, res) => { res.sed("signed up")});

user.get("/account", (req, res) => { res.render('account-page') });
user.patch("/account", (req, res) => { res.send("your account changed")})

user.get("/profiles/:profileId", (req, res) => { res.send ("profile page")})

module.exports = user;