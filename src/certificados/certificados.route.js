const routerCertificados = require("express").Router();
const multer = require("multer");
const {
  getDetalleCursosInstructores,
  getCertificadosByCursos,
  getCertificados,
  registerParticipantes,
  registerCertificado,
} = require("./certificados.controller");
const upload = multer({ storage: multer.memoryStorage() });

routerCertificados.get("/detalle/:id_cur", getDetalleCursosInstructores);
routerCertificados.get("/:id_cur", getCertificadosByCursos);
routerCertificados.get("/", getCertificados);
routerCertificados.post("/participantes/", registerParticipantes);
routerCertificados.post("/", upload.single("certificado"), registerCertificado);

module.exports = routerCertificados;
