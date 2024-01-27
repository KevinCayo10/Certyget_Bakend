// Importar módulos y controladores necesarios
const routerCertificados = require("express").Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const {
  getDetalleCursosInstructores,
  getCertificadosByCursos,
  getCertificados,
  registerParticipantes,
  registerCertificado,
  deleteCertificado,
  getCertificadoByCedAndApe,
  validarCertificado,
  getCertificadoByCursoAndCedAndApe,
  searchCertificados,
} = require("./certificados.controller");

const upload = multer({ storage: multer.memoryStorage() });

routerCertificados.post("/", upload.single("certificado"), registerCertificado);
routerCertificados.get("/search/", searchCertificados);
routerCertificados.get("/detalle/:id_cur", getDetalleCursosInstructores);
routerCertificados.get("/:id_cur", getCertificadosByCursos);
routerCertificados.get("/:ced_par/:ape_par", getCertificadoByCedAndApe);
routerCertificados.get(
  "/:ced_par/:ape_par/:id_cur",
  getCertificadoByCursoAndCedAndApe
);

routerCertificados.get("/", getCertificados);
routerCertificados.get("/validate/code/cer/:cod_gen_cer", validarCertificado);

routerCertificados.post("/participantes/", registerParticipantes);
routerCertificados.delete("/:id_gen_cer", deleteCertificado);

// Exportar el routerCertificados para su uso en otras partes de la aplicación
module.exports = routerCertificados;
