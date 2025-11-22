const session = require("express-session");
const MySQLStore = require('express-mysql-session')(session);
const { options } = require("../../config/session_storage_config");

const sessionStorage = new MySQLStore(options);
module.exports = sessionStorage;