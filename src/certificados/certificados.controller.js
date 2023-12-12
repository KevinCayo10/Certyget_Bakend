const {
  getCertificadoByIdCursos,
  getDetalleCursosByIdCurso,
  getDetalleInstructoresByIdCurso,
} = require("./certificados.service");

const registerCertificado = (req, res) => {};

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

    return res.json({
      success: 1,
      data: {
        curso,
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
const obtenerDetalleCursos = (id_cur) => {
  return new Promise((resolve, reject) => {
    getDetalleCursosByIdCurso(id_cur, (err, results) => {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        resolve(results[0]);
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
module.exports = { getCertificadosByCursos, getDetalleCursosInstructores };
