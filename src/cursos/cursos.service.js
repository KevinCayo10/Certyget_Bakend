const pool = require("../config/database");
// Función para crear cursos

const createCursos = (data, callBack) => {
  const fechaIniFormatted = new Date(data.fecha_inicio_cur)
    .toISOString()
    .slice(0, 19)
    .replace("T", " ");

  const fechaFinFormatted = new Date(data.fecha_fin_cur)
    .toISOString()
    .slice(0, 19)
    .replace("T", " ");

  pool.query(
    `INSERT INTO 
  cursos (nom_cur,fecha_inicio_cur, fecha_fin_cur, dur_cur,url_cer,det_cer, estado_cur, id_cate_cur) VALUES (?,?,?,?,?,?,?,?)`,
    [
      data.nom_cur,
      fechaIniFormatted,
      fechaFinFormatted,
      data.dur_cur,
      data.url_cer,
      data.det_cer,
      1,
      data.id_cate_cur,
    ],
    (err, res) => {
      if (err) {
        return callBack(err);
      }
      const id_cur = res.insertId;

      return callBack(null, id_cur);
    }
  );
};
// Promesa para crear cursos

const createCursosPromise = (data) => {
  return new Promise((resolve, reject) => {
    createCursos(data, (err, id_cur) => {
      if (err) {
        reject(err);
      } else {
        resolve(id_cur);
      }
    });
  });
};
// Función para crear plantillas de certificados

const createPlantillaCer = (plantilla_cer, callBack) => {
  pool.query(
    `INSERT INTO plantillas_certificados (url_cer) VALUES (?)`,
    [plantilla_cer],
    (err, results) => {
      if (err) {
        return callBack(err);
      }
      // Recuperar el id_cer del resultado y pasarlo al callback
      const id_cer = results.insertId;
      return callBack(null, id_cer);
    }
  );
};
// Promesa para crear plantillas de certificados

const createPlantillaCerPromise = (plantilla_cer) => {
  return new Promise((resolve, reject) => {
    createPlantillaCer(plantilla_cer, (err, id_cer) => {
      if (err) {
        reject(err);
      } else {
        resolve(id_cer);
      }
    });
  });
};
// Función para crear detalles de cursos

const createDetalleCursos = (data, callBack) => {
  pool.getConnection((err, connection) => {
    if (err) {
      return callBack(err);
    }

    connection.beginTransaction((err) => {
      if (err) {
        connection.release();
        return callBack(err);
      }

      connection.query(
        `INSERT INTO detalle_cursos(id_cur, id_inst) VALUES (?, ?)`,
        [data.id_cur, data.id_inst],
        (err, results) => {
          if (err) {
            return connection.rollback(() => {
              connection.release();
              return callBack(err);
            });
          }

          connection.commit((err) => {
            if (err) {
              return connection.rollback(() => {
                connection.release();
                return callBack(err);
              });
            }

            connection.release();
            const insertedId = results.insertId;
            console.log("DATA DETALLE : ", data.id_cur, data.id_inst);
            console.log("Inserted ID:", insertedId);
            return callBack(null, results);
          });
        }
      );
    });
  });
};
// Función para obtener datos de cursos

const getCursosData = (callBack) => {
  pool.query(
    `SELECT 
  c.*,
  cat.nom_cate,
  GROUP_CONCAT(i.ced_inst) AS ced_inst
FROM cursos c
LEFT JOIN categorias cat ON c.id_cate_cur = cat.id_cate
LEFT JOIN detalle_cursos dc ON c.id_cur = dc.id_cur
LEFT JOIN autoridades i ON dc.id_inst = i.ced_inst
-- WHERE c.estado_cur = 1
GROUP BY c.id_cur, cat.nom_cate, c.estado_cur  -- Incluye las columnas necesarias para GROUP BY
ORDER BY c.estado_cur DESC`,
    [],
    (err, results) => {
      if (err) {
        return callBack(err);
      }
      return callBack(null, results);
    }
  );
};
// Función para obtener instructores por ID de curso

const getInstructoreByIdCurso = (id_cur, callBack) => {
  pool.query(
    `SELECT i.* FROM instructores i
    INNER JOIN detalle_cursos dc ON i.ced_inst = dc.id_inst
    WHERE dc.id_cur = ?`,
    [id_cur],
    (err, results) => {
      if (err) {
        return callBack(err);
      }
      return callBack(null, results);
    }
  );
};
// Función para actualizar cursos por ID de curso

const updateCursosByCursos = (id_cu, data, callBack) => {
  const fechaIniFormatted = new Date(data.fecha_inicio_cur)
    .toISOString()
    .slice(0, 19)
    .replace("T", " ");

  const fechaFinFormatted = new Date(data.fecha_fin_cur)
    .toISOString()
    .slice(0, 19)
    .replace("T", " ");

  pool.query(
    `UPDATE cursos SET nom_cur=?, fecha_inicio_cur=?, fecha_fin_cur=?, dur_cur=?,url_cer=?,det_cer=?, estado_cur=?, id_cate_cur=? WHERE id_cur=?`,
    [
      data.nom_cur,
      fechaIniFormatted,
      fechaFinFormatted,
      data.dur_cur,
      data.url_cer,
      data.det_cer,
      data.estado_cur,
      data.id_cate_cur,
      id_cu,
    ],
    (err, results) => {
      if (err) {
        return callBack(err);
      }
      return callBack(null, results);
    }
  );
};
// Función para eliminar cursos en la tabla detalle_cursos por ID de curso

const deleteCursoInDetalleCursos = (id_cur, callBack) => {
  pool.query(
    `DELETE  FROM detalle_cursos  WHERE id_cur=?`,
    [id_cur],
    (error, results, fields) => {
      if (error) {
        return callBack(error);
      }
      return callBack(null, results[0]);
    }
  );
};
// Función para eliminar cursos por ID de curso

const deleteCursoByIdCursos = (id_cur, callBack) => {
  pool.query(
    `UPDATE cursos SET estado_cur=?  WHERE id_cur=?`,
    [0, id_cur],
    (error, results, fields) => {
      if (error) {
        return callBack(error);
      }
      return callBack(null, results[0]);
    }
  );
};
// Función para obtener datos de cursos filtrados para aplicaciones móviles

const getCursosFilterMobile = (callBack) => {
  pool.query(
    `SELECT 
    c.*,
    cat.nom_cate,
    GROUP_CONCAT(i.ced_inst) AS ced_inst`,
    []
  );
};
// Exporta todas las funciones para su uso en otros archivos

module.exports = {
  createCursos,
  createPlantillaCer,
  createDetalleCursos,
  createPlantillaCerPromise,
  createCursosPromise,
  getCursosData,
  updateCursosByCursos,
  deleteCursoInDetalleCursos,
  deleteCursoByIdCursos,
  getInstructoreByIdCurso,
};
