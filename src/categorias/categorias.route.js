const routerCategory = require("express").Router();
const { checkToken } = require("../auth/token.js");
const {
  createCategory,
  getCategorys,
  getCategory,
  updateCategory,
  deleteCategory,
} = require("./categorias.controller");
routerCategory.post("/", checkToken, createCategory);
routerCategory.get("/", checkToken, getCategorys);
routerCategory.get("/:id_cate", checkToken, getCategory);
routerCategory.put("/:id_cate", checkToken, updateCategory);
routerCategory.delete("/:id_cate", checkToken, deleteCategory);

module.exports = routerCategory;
