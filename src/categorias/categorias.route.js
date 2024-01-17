const routerCategory = require("express").Router();
const { checkToken } = require("../auth/token.js");
// Importa las funciones del controlador de categorías
const {
  createCategory,
  getCategorys,
  getCategory,
  updateCategory,
  deleteCategory,
} = require("./categorias.controller");
// Define las rutas y asigna las funciones del controlador a cada operación CRUD
routerCategory.post("/", createCategory);// Ruta para crear una nueva categoría
routerCategory.get("/", getCategorys);// Ruta para obtener todas las categorías
routerCategory.get("/:id_cate", getCategory);// Ruta para obtener una categoría por ID
routerCategory.put("/:id_cate", updateCategory);// Ruta para actualizar una categoría por ID
routerCategory.delete("/:id_cate", deleteCategory);// Ruta para eliminar una categoría por ID
// Exporta el enrutador configurado
module.exports = routerCategory;
