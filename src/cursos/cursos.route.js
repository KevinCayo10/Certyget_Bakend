const routerCursos = require("express").Router();
const multer = require("multer");
// Configura multer para almacenar los archivos en memoria
const upload = multer({ storage: multer.memoryStorage() });
// Importa funciones y middleware necesarios desde otros archivos
const { checkToken } = require("../auth/token.js");
const {
  createCurso,
  getCursos,
  updateCurso,
  deleteCursos,
} = require("./cursos.controller.js");
// Configura las rutas del router
routerCursos.post("/", upload.single("url_cer"), createCurso);
routerCursos.get("/", getCursos);
routerCursos.put("/:id_cur", upload.single("url_cer"), updateCurso);
routerCursos.delete("/:id_cur", deleteCursos);
// Exporta el router configurado para su uso en otras partes de la aplicación
module.exports = routerCursos;
