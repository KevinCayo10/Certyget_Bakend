const routerUser = require("express").Router();
const { checkToken } = require("../auth/token.js");
const {
  login,
  createUser,
  getUsers,
  getUser,
  updateUsers,
  deleteUsers,
} = require("./user.controller");
routerUser.post("/login", login);
routerUser.post("/", createUser);
routerUser.get("/", getUsers);
routerUser.get("/:id_usu", getUser);
routerUser.put("/:id_usu", updateUsers);
routerUser.delete("/:id_usu", deleteUsers);

module.exports = routerUser;
