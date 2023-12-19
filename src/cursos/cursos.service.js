const pool = require("../config/database");

const createCursos = (data, callBack) => {
  pool.query(
    `INSERT INTO 
  cursos (nom_cur,fecha_inicio_cur, fecha_fin_cur, dur_cur,estado_cur, id_cate_cur, id_cur_cer) VALUES (?,?,?,?,?,?,?)`,
    [
      data.nom_cur,
      data.fecha_inicio_cur,
      data.fecha_fin_cur,
      data.dur_cur,
      1,
      data.id_cate_cur,
      data.id_cur_cer,
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

const createDetalleCursos = (data, callBack) => {
  pool.query(
    `INSERT INTO detalle_cursos  (id_cur,id_inst) VALUES (?,?)`,
    [data.id_cur, data.id_inst],
    (err, results) => {
      if (err) {
        return callBack(err);
      }
      // Recuperar el id_cer del resultado y pasarlo al callback
      return callBack(null, results);
    }
  );
};

const getCursosData = (callBack) => {
  pool.query(
    `SELECT c.*, cat.nom_cate, pc.url_cer
    FROM cursos c
    LEFT JOIN categorias cat ON c.id_cate_cur = cat.id_cate
    LEFT JOIN plantillas_certificados pc ON c.id_cur_cer = pc.id_cer
    WHERE c.estado_cur = 1`,
    [],
    (err, results) => {
      if (err) {
        return callBack(err);
      }
      return callBack(null, results);
    }
  );
};

const updateCursosByCursos = (id_cu, data, callBack) => {
  pool.query(
    `UPDATE cursos SET nom_cur=?, fecha_inicio_cur=?, fecha_fin_cur=?, dur_cur=?, id_cate_cur=?, id_cur_cer=? WHERE id_cur=?`,
    [
      data.nom_cur,
      data.fecha_inicio_cur,
      data.fecha_fin_cur,
      data.dur_cur,
      data.id_cate_cur,
      data.id_cur_cer,
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
};
