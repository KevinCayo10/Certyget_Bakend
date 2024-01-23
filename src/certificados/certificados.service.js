// Importar el módulo de conexión a la base de datos
const pool = require("../config/database");
const { buildCode } = require("../utils/generateCode");
// Función para obtener información de certificados
const getCertificadoData = (callBack) => {
  pool.query(
    `SELECT
      gc.*,
      p.*
    FROM
      generar_certificados gc
    JOIN
      participantes p ON p.ced_par = gc.ced_par_cer
    AND gc.estado_cer=1`,
    [],
    (error, results, fields) => {
      if (error) {
        callBack(error);
      }
      return callBack(null, results);
    }
  );
};
// Función para obtener certificados por ID de cursos
const getCertificadoByIdCursos = (id_cur, callBack) => {
  pool.query(
    `SELECT
      c.*,
      gc.*,
      p.*
    FROM
      generar_certificados gc
    JOIN
      participantes p ON p.ced_par = gc.ced_par_cer
    JOIN
      cursos c ON c.id_cur = gc.id_cur_cer
    WHERE
      gc.id_cur_cer= ?
      AND gc.estado_cer=1`,
    [id_cur],
    (error, results, fields) => {
      if (error) {
        callBack(error);
      }
      return callBack(null, results);
    }
  );
};
// Función para registrar certificados
const createCertificado = (data, callBack) => {
  // Verificar si ya existe un registro con los mismos valores
  pool.query(
    `SELECT * FROM generar_certificados WHERE ced_par_cer = ? AND id_cur_cer = ?`,
    [data.ced_par_cer, data.id_cur_cer],
    (error, results, fields) => {
      if (error) {
        return callBack(error);
      }

      // Si ya existe un registro, devolver un error
      if (results.length > 0) {
        return callBack({
          message: "Ya existe un certificado con estos valores",
        });
      }
      console.log(data);
      // Si no hay duplicados, proceder con la inserción
      pool.query(
        `INSERT INTO generar_certificados(url_gen_cer, cod_gen_cer, estado_cer, fecha_gen_cer, ced_par_cer,id_cur_cer) VALUES(?,?,?,?,?,?)`,
        [
          data.url_gen_cer,
          data.cod_gen_cer,
          data.estado_cer,
          data.fecha_gen_cer,
          data.ced_par_cer,
          data.id_cur_cer,
        ],
        (insertError, insertResults, insertFields) => {
          if (insertError) {
            return callBack(insertError);
          }
          return callBack(null, insertResults[0]);
        }
      );
    }
  );
};

// Función para obtener detalles de cursos por ID de curso
const getDetalleCursosByIdCurso = (id_cur, callBack) => {
  console.log("ID_CUR:", id_cur);
  pool.query(
    `SELECT
      c.*,
      cat.*
    FROM
      cursos c
    JOIN
      categorias cat ON c.id_cate_cur = cat.id_cate
    JOIN
      detalle_cursos dc ON c.id_cur = dc.id_cur
    WHERE
      c.id_cur = ?`,
    [id_cur],
    (error, results, fields) => {
      if (error) {
        callBack(error);
      }
      console.log("RESULTS: ", results);
      return callBack(null, results);
    }
  );
};

// Función para obtener detalles de instructores por ID de curso
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
// Función para registrar participantes
const createParticipantes = (data, callBack) => {
  // Mapea el array de participantes y crea un array de valores para cada participante
  console.log(data);
  const participantesValues = data.map((participante) => [
    participante.ced_par,
    participante.nom_pat_par,
    participante.nom_mat_par,
    participante.ape_pat_par,
    participante.ape_mat_par,
    participante.telf_par.toString(),
    participante.email_par,
    participante.dir_par,
    participante.ciud_par,
    participante.carrera_par,
    participante.fac_par,
    participante.uni_par,
  ]);

  // Query SQL para la inserción múltiple
  const sql = `INSERT IGNORE INTO participantes (ced_par, nom_pat_par, nom_mat_par, ape_pat_par, ape_mat_par, telf_par, email_par, dir_par, ciud_par, carrera_par, fac_par, uni_par) VALUES ?`;

  // Ejecuta la consulta
  pool.query(sql, [participantesValues], (error, results, fields) => {
    if (error) {
      console.error("Error al ejecutar la consulta:", error);
      return callBack("Error al insertar participantes en la base de datos");
    }
    return callBack(null, results);
  });
};
// Función para eliminar certificado por ID
const deleteCertificadoByIdGenCer = (id_gen_cer, callBack) => {
  pool.query(
    `UPDATE generar_certificados SET estado_cer=0 WHERE id_gen_cer=?`,
    [id_gen_cer],
    (error, results, fields) => {
      if (error) {
        callBack(error);
      }
      return callBack(null, results);
    }
  );
};
// Función para obtener certificados por cédula y apellido
const getCertificadoByPar = (ced_par, ape_par, callBack) => {
  pool.query(
    `SELECT
      gc.*,
      p.*
    FROM
      generar_certificados gc
    JOIN
      participantes p ON p.ced_par = gc.ced_par_cer
    WHERE
      p.ced_par = ?
      AND p.ape_pat_par = ?
      AND gc.estado_cer=1`,
    [ced_par, ape_par],
    (error, results, fields) => {
      if (error) {
        callBack(error);
      }
      return callBack(null, results);
    }
  );
};
// Función para obtener cursos por apellido y cédula
const getCursosByPar = (ape_par, ced_par, callBack) => {
  pool.query(
    `SELECT
      c.*
    FROM
      generar_certificados gc
    JOIN
      cursos c ON c.id_cur = gc.id_cur_cer
    JOIN
      participantes p ON p.ced_par = gc.ced_par_cer
    WHERE
      p.ape_pat_par = ?
      AND p.ced_par = ?
      AND gc.estado_cer=1`,
    [ape_par, ced_par],
    (error, results, fields) => {
      if (error) {
        callBack(error);
      }
      return callBack(null, results);
    }
  );
};
// Función para obtener certificados por cédula, curso y apellido
const getCertificadosDataByCursosAndParticipante = (
  ced_par,
  id_cur,
  callBack
) => {
  pool.query(
    `SELECT
    gc.*,
    p.*,
    c.*
  FROM
    generar_certificados gc
  JOIN
    participantes p ON p.ced_par = gc.ced_par_cer
  JOIN
    cursos c ON c.id_cur = gc.id_cur_cer
  WHERE
    p.ced_par = ?
    AND c.id_cur = ?
    AND gc.estado_cer=1`,
    [ced_par, id_cur],
    (error, results, fields) => {
      if (error) {
        callBack(error);
      }
      console.log(results);
      return callBack(null, results);
    }
  );
};
// Función para validar certificado por código
const validateCertificadoByCodGenCer = (cod_gen_cer, callBack) => {
  pool.query(
    `SELECT 
    gc.*,
    p.*,
    c.*    
    FROM generar_certificados gc
    JOIN 
    participantes p ON p.ced_par = gc.ced_par_cer
    JOIN
    cursos c ON c.id_cur=gc.id_cur_cer
    WHERE cod_gen_cer=?`,
    [cod_gen_cer],
    (error, results, fields) => {
      if (error) {
        callBack(error);
      }
      console.log(results);
      return callBack(null, results);
    }
  );
};

const getCertificadoByCedNameEmail = (search, callBack) => {
  pool.query(
    `SELECT
    gc.*,
    p.*
  FROM
    generar_certificados gc
  JOIN
    participantes p ON p.ced_par = gc.ced_par_cer
  WHERE
    p.ced_par  LIKE  ?
    OR p.ape_pat_par  LIKE  ?
    OR p.email_par  LIKE  ?
    AND gc.estado_cer = 1`,
    [`%${search}%`, `%${search}%`, `%${search}%`],
    (error, results, fields) => {
      if (error) {
        callBack(error);
      }
      return callBack(null, results);
    }
  );
};
// Exportar las funciones para su uso en otras partes de la aplicación
module.exports = {
  getCertificadoByIdCursos,
  createCertificado,
  getDetalleCursosByIdCurso,
  getDetalleInstructoresByIdCurso,
  getCertificadoByIdCursos,
  getCertificadoData,
  createParticipantes,
  deleteCertificadoByIdGenCer,
  getCertificadoByPar,
  validateCertificadoByCodGenCer,
  getCursosByPar,
  getCertificadosDataByCursosAndParticipante,
  getCertificadoByCedNameEmail,
};
