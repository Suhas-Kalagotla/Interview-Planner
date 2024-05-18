const express = require("express");
const auth_router = express.Router();
var auth_lib = require("../lib/authLib/authController");

auth_router.post("/google-login", auth_lib.GoogleLoginSql );

module.exports = auth_router;
