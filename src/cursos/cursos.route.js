const routerCursos = require("express").Router();
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

const { checkToken } = require("../auth/token.js");
const { createCurso, getCursos } = require("./cursos.controller.js");

routerCursos.post("/", upload.single("plantilla_cer"), createCurso);
routerCursos.get("/", getCursos);

module.exports = routerCursos;
