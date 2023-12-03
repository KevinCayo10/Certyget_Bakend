const routerUser = require("express").Router();
const { checkToken } = require("../auth/token.js");
const { login } = require("./user.controller.js");
routerUser.post("/login", login);

module.exports = routerUser;
