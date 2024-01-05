const storage = require("../config/gcloud");
const {
  getCertificadoByIdCursos,
  getDetalleCursosByIdCurso,
  getDetalleInstructoresByIdCurso,
  getCertificadoData,
  createParticipantes,
  createCertificado,
  deleteCertificadoByIdGenCer,
  getCertificadoByPar,
  validateCertificadoByCodGenCer,
  getCursosByPar,
  getCertificadosDataByCursosAndParticipante,
} = require("./certificados.service");
const bucket = storage.bucket(`${process.env.BUCKET_NAME}`);
const { v4: uuidv4 } = require("uuid");

function generateUniqueId() {
  return uuidv4();
}
const registerCertificado = async (req, res) => {
  const body = req.body;
  console.log("CER", body);
  console.log("FILE : ", req.file);
  if (!body) {
    return res
      .status(400)
      .send({ success: 0, message: "Please there are not data" });
  }

  if (!req.file) {
    return res
      .status(400)
      .send({ success: 0, message: "Please upload a file!" });
  }

  const fileExtension = req.file.originalname.split(".").pop();
  const fileName = `${body.ced_par}${body.id_cur}.${fileExtension}`;
  const file = bucket.file(
    `certificados/${body.ced_par}/${fileName}_${generateUniqueId()}`
  );
  // Subir archivo al bucket utilizando un buffer
  await file.save(req.file.buffer, {
    resumable: false,
    contentType: req.file.mimetype, // Asegúrate de que el mimetype sea correcto
  });

  // Hacer el archivo público
  try {
    await file.makePublic();
  } catch (error) {
    console.error("Error al hacer público el archivo:", error);
    return res.status(500).send({
      message: `Uploaded the file successfully: ${fileName}, but public access is denied!`,
      url: file.publicUrl(),
    });
  }
  //Guardar toda la información en la base de datos
  const fechaGenCer = new Date().toISOString().slice(0, 10);
  console.log("FECHA_GEN_CER _ ", fechaGenCer);

  // Guardar toda la información en la base de datos
  const data = {
    url_gen_cer: file.publicUrl(),
    estado_cer: 1,
    fecha_gen_cer: fechaGenCer,
    ced_par_cer: body.ced_par,
    id_cur_cer: body.id_cur,
  };
  console.log("BODY: ", data);
  createCertificado(data, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(500).json({
        success: 0,
        message: "Database connection error",
      });
    }
    return res.status(200).json({
      success: 1,
      data: results,
    });
  });
};

const getCertificados = (req, res) => {
  getCertificadoData((err, results) => {
    if (err) {
      console.log(err);
      return;
    }
    return res.json({
      success: 1,
      data: results,
    });
  });
};

const getCertificadosByCursos = (req, res) => {
  getCertificadoByIdCursos(req.params.id_cur, (err, results) => {
    if (err) {
      console.log(err);
      return;
    }
    return res.json({
      success: 1,
      data: results,
    });
  });
};

const getDetalleCursosInstructores = async (req, res) => {
  try {
    let curso = await obtenerDetalleCursos(req.params.id_cur);
    let instructores = await obtenerDetalleInstructores(req.params.id_cur);
    // Formatear las fechas en el objeto curso
    console.log("DATA ANTES: ", curso[0]);
    curso[0].fecha_inicio_cur = formatDate(curso[0].fecha_inicio_cur);
    curso[0].fecha_fin_cur = formatDate(curso[0].fecha_fin_cur);
    console.log("CURSO : ", curso[0]);
    return res.json({
      success: 1,
      data: {
        curso: curso[0],
        instructores,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: 0,
      error: "Error al obtener detalles de cursos e instructores",
    });
  }
};
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};
const obtenerDetalleCursos = (id_cur) => {
  return new Promise((resolve, reject) => {
    getDetalleCursosByIdCurso(id_cur, (err, results) => {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};

const obtenerDetalleInstructores = (id_cur) => {
  return new Promise((resolve, reject) => {
    getDetalleInstructoresByIdCurso(id_cur, (err, results) => {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};

const registerParticipantes = (req, res) => {
  const body = req.body;
  console.log("BODY PARTICIPANTE  : ", body);
  if (!body) {
    return res
      .status(400)
      .send({ success: 0, message: "Please there are not data" });
  }
  createParticipantes(body, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(500).json({
        success: 0,
        message: "Database connection error",
      });
    }
    return res.status(200).json({
      success: 1,
      data: results,
    });
  });
};
const deleteCertificado = (req, res) => {
  const id_cer = req.params.id_gen_cer;
  deleteCertificadoByIdGenCer(id_cer, (err, results) => {
    if (err) {
      console.log(err);
      return;
    }
    if (!results) {
      return res.json({
        success: 0,
        message: "Record not found",
      });
    }
    return res.json({
      success: 1,
      message: "Certificado deleted successfully",
    });
  });
};
const getCertificadoByCedAndApe = (req, res) => {
  let certificados = [];
  let cursos = [];
  getCertificadoByPar(
    req.params.ced_par,
    req.params.ape_par,
    (err, results) => {
      if (err) {
        console.log(err);
        return;
      }
      if (!results) {
        return res.json({
          success: 0,
          message: "Record not found",
        });
      }
      console.log(results);
      certificados = results;
      getCursosByPar(req.params.ape_par, req.params.ced_par, (err, results) => {
        if (err) {
          console.log(err);
          return;
        }
        if (!results) {
          return res.json({
            success: 0,
            message: "Record not found",
          });
        }
        cursos = results;
        return res.json({
          success: 1,
          data: {
            certificados,
            cursos,
          },
        });
      });
    }
  );
};

const getCertificadoByCursoAndCedAndApe = (req, res) => {
  getCertificadosDataByCursosAndParticipante(
    req.params.ced_par,
    req.params.id_cur,
    (err, results) => {
      if (err) {
        console.log(err);
        return;
      }
      if (!results) {
        return res.json({
          success: 0,
          message: "Record not found",
        });
      }
      return res.json({
        success: 1,
        data: results,
      });
    }
  );
};

const validarCertificado = (req, res) => {
  console.log("HOLA MUNDO");
  const cod_gen_cer = req.params.cod_gen_cer;
  console.log("COD : ", cod_gen_cer);
  validateCertificadoByCodGenCer(cod_gen_cer, (err, results) => {
    if (err) {
      console.log(err);
      return;
    }
    if (!results) {
      return res.json({
        success: 0,
        message: "Record not found",
      });
    }
    return res.json({
      success: 1,
      data: results,
    });
  });
};
module.exports = {
  getCertificadosByCursos,
  getDetalleCursosInstructores,
  getCertificados,
  registerParticipantes,
  registerCertificado,
  deleteCertificado,
  getCertificadoByCedAndApe,
  validarCertificado,
  getCertificadoByCursoAndCedAndApe,
};
