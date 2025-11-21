const express = require("express");
const user = express.Router();

user.get("/login", (req, res) => { res.send("login page")});
user.post("/login", (req, res) => { });

user.get("/sign-up", (req, res) => { res.send("sign-up page")});
user.post("/sign-up", (req, res) => { res.sed("signed up")});

user.get("/account", (req, res) => { res.send("your account")});
user.patch("/account", (req, res) => { res.send("your account changed")})

user.get("/profiles/:profileId", (req, res) => { res.send ("profile page")})

module.exports = user;