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
routerUser.post("/", checkToken, createUser);
routerUser.get("/", checkToken, getUsers);
routerUser.get("/:id_usu", checkToken, getUser);
routerUser.put("/:id_usu", checkToken, updateUsers);
routerUser.delete("/:id_usu", checkToken, deleteUsers);

module.exports = routerUser;
