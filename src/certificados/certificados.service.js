const pool = require("../config/database");
// query donde ingrese el id curso y retorna la información para el certificado

const getCertificadoData = (callBack) => {
  pool.query(
    `SELECT
      gc.*,
      p.*
    FROM
      generar_certificados gc
    JOIN
      participantes p ON p.ced_par = gc.ced_par_cer
    `,
    [],
    (error, results, fields) => {
      if (error) {
        callBack(error);
      }
      return callBack(null, results);
    }
  );
};

const getCertificadoByIdCursos = (id_cur, callBack) => {
  pool.query(
    `SELECT
      gc.*,
      p.*
    FROM
      generar_certificados gc
    JOIN
      participantes p ON p.ced_par = gc.ced_par_cer
    WHERE
      gc.id_cur_cer= ?`,
    [id_cur],
    (error, results, fields) => {
      if (error) {
        callBack(error);
      }
      return callBack(null, results);
    }
  );
};
// query para el registro de certificados
const createCertificado = (data, callBack) => {
  pool.query(
    `insert into generar_certificados(url_gen_cer,estado_cer,fecha_gen_cer, ced_par_cer,id_cur_cer) values(?,?,?,?,?)`,
    [
      data.url_gen_cer,
      data.estado_cer,
      data.fecha_gen_cer,
      data.ced_par_cer,
      data.id_cur_cer,
    ],
    (error, results, fields) => {
      if (error) {
        return callBack(error);
      }
      return callBack(null, results[0]);
    }
  );
};
//query para obtener el detalle de eventos e instructores
const getDetalleCursosByIdCurso = (id_cur, callBack) => {
  pool.query(
    `SELECT
      c.*,
      cat.*,
      pc.url_cer AS url_plantilla
    FROM
      cursos c
    JOIN
      categorias cat ON c.id_cate_cur = cat.id_cate
    JOIN
      plantillas_certificados pc ON c.id_cur_cer = pc.id_cer
    JOIN
      detalle_cursos dc ON c.id_cur = dc.id_cur
    WHERE
      c.id_cur = ?`,
    [id_cur],
    (error, results, fields) => {
      if (error) {
        callBack(error);
      }
      return callBack(null, results);
    }
  );
};
// Para obtener el detalle de instructores
const getDetalleInstructoresByIdCurso = (id_cur, callBack) => {
  pool.query(
    `SELECT
      a.*
    FROM
      cursos c
    JOIN
      detalle_cursos dc ON c.id_cur = dc.id_cur
    JOIN
      autoridades a ON dc.id_inst = a.ced_inst
    WHERE
      c.id_cur = ?`,
    [id_cur],
    (error, results, fields) => {
      if (error) {
        callBack(error);
      }
      return callBack(null, results);
    }
  );
};
// query para la verificación de duplicación de certificados
const createParticipantes = (data, callBack) => {
  // Mapea el array de participantes y crea un array de valores para cada participante
  const participantesValues = data.map((participante) => [
    participante.ced_par,
    participante.nom_pat_par,
    participante.nom_mat_par,
    participante.ape_pat_par,
    participante.ape_mat_par,
    participante.telf_par,
    participante.email_par,
    participante.dir_par,
    participante.carrera_par,
    participante.fac_par,
    participante.uni_par,
  ]);

  // Query SQL para la inserción múltiple
  const sql = `INSERT INTO participantes (ced_par, nom_pat_par, nom_mat_par, ape_pat_par, ape_mat_par, telf_par, email_par, dir_par, carrera_par, fac_par, uni_par) VALUES ?`;

  // Ejecuta la consulta
  pool.query(sql, [participantesValues], (error, results, fields) => {
    if (error) {
      return callBack(error);
    }
    return callBack(null, results);
  });
};

module.exports = {
  getCertificadoByIdCursos,
  createCertificado,
  getDetalleCursosByIdCurso,
  getDetalleInstructoresByIdCurso,
  getCertificadoByIdCursos,
  getCertificadoData,
  createParticipantes,
};
