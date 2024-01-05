const routerCertificados = require("express").Router();
const multer = require("multer");
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
} = require("./certificados.controller");
const upload = multer({ storage: multer.memoryStorage() });

routerCertificados.get("/detalle/:id_cur", getDetalleCursosInstructores);
routerCertificados.get("/:id_cur", getCertificadosByCursos);
routerCertificados.get("/:ced_par/:ape_par", getCertificadoByCedAndApe);
routerCertificados.get(
  "/:ced_par/:ape_par/:id_cur",
  getCertificadoByCursoAndCedAndApe
);

routerCertificados.get("/", getCertificados);
routerCertificados.get("/validate/code/:cod_gen_cer", validarCertificado);

routerCertificados.post("/participantes/", registerParticipantes);
routerCertificados.post("/", upload.single("certificado"), registerCertificado);
routerCertificados.delete("/:id_gen_cer", deleteCertificado);

module.exports = routerCertificados;
