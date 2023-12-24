const routerCursos = require("express").Router();
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

const { checkToken } = require("../auth/token.js");
const {
  createCurso,
  getCursos,
  updateCurso,
  deleteCursos,
} = require("./cursos.controller.js");

routerCursos.post("/", upload.single("url_cer"), createCurso);
routerCursos.get("/", getCursos);
routerCursos.put("/:id_cur", upload.single("url_cer"), updateCurso);
routerCursos.delete("/:id_cur", deleteCursos);

module.exports = routerCursos;
