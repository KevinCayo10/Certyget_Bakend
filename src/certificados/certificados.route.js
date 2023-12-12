const routerCertificados = require("express").Router();
const multer = require("multer");
const {
  getDetalleCursosInstructores,
  getCertificadosByCursos,
} = require("./certificados.controller");
const upload = multer({ storage: multer.memoryStorage() });

routerCertificados.get("/detalle/:id_cur", getDetalleCursosInstructores);
routerCertificados.get("/:id_cur", getCertificadosByCursos);

module.exports = routerCertificados;
