const routerCategory = require("express").Router();
const { checkToken } = require("../auth/token.js");
const {
  createCategory,
  getCategorys,
  getCategory,
  updateCategory,
  deleteCategory,
} = require("./categorias.controller");
routerCategory.post("/", createCategory);
routerCategory.get("/", getCategorys);
routerCategory.get("/:id_cate", getCategory);
routerCategory.put("/:id_cate", updateCategory);
routerCategory.delete("/:id_cate", deleteCategory);

module.exports = routerCategory;
