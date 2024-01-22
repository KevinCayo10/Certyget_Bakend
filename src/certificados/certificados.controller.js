// const storage = require("../config/gcloud");
const transporter = require("../helpers/mailer");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const {
  // Importación de funciones desde el servicio de certificados
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

// Configuración del almacenamiento en la nube y otros módulos
// const bucket = storage.bucket(`${process.env.BUCKET_NAME}`);

// Función para registrar un certificado
const registerCertificado = async (req, res) => {
  const body = req.body;
  const file = req.file;

  console.log("CER", body);
  console.log("FILE : ", req.file);
  // Validaciones iniciales
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
  const certificadoFolder = path.join(__dirname, "../../images/certificados");
  const idCedParFolder = path.join(certificadoFolder, body.ced_par.toString());

  // Crea las carpetas si no existen
  fs.mkdirSync(certificadoFolder, { recursive: true });
  fs.mkdirSync(idCedParFolder, { recursive: true });

  // Guarda el archivo en la carpeta destino
  const fileExtension = file.originalname.split(".").pop();
  const fileName = `${body.nom_cur}_${Date.now()}.${fileExtension}`;
  const filePath = path.join(idCedParFolder, fileName);
  fs.writeFileSync(filePath, file.buffer);

  // Construye la URL completa de la imagen
  const imageUrl = `${process.env.URL_SERVER}/images/certificados/${body.ced_par}/${fileName}`;
  body.certificado = imageUrl;
  const fechaGenCer = new Date().toISOString().slice(0, 10);
  console.log("FECHA_GEN_CER _ ", fechaGenCer);

  // Guardar toda la información en la base de datos
  const data = {
    url_gen_cer: body.certificado,
    estado_cer: 1,
    fecha_gen_cer: fechaGenCer,
    ced_par_cer: body.ced_par,
    id_cur_cer: body.id_cur,
  };
  console.log("BODY: ", body);
  // Manejador para crear un certificado
  createCertificado(data, async (err, results) => {
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
// Endpoint para obtener todos los certificados
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
// Endpoint para obtener certificados por curso
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
// Endpoint para obtener detalles de cursos e instructores
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
// Función para formatear fechas en el formato dd/mm/yyyy
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};
// Función para obtener detalles de cursos por ID
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
// Función para obtener detalles de instructores por ID de curso
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
// Endpoint para registrar participantes
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
// Endpoint para eliminar un certificado por ID
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
// Endpoint para obtener certificados por número de cédula y apellido
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
// Endpoint para obtener certificados por ID de curso y número de cédula y apellido
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
// Endpoint para validar un certificado por código generado
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
// Exportar los controladores como módulos

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
