const pool = require("../config/database");
// Función para crear una nueva categoría
const createCategorys = (data, callBack) => {
  pool.query(
    `insert into categorias(nom_cate,desc_cate,estado_cate) values(?,?,?)`,
    [data.nom_cate, data.desc_cate, 1],
    (error, results, fields) => {
      if (error) {
        callBack(error);
      }
      return callBack(null, results);
    }
  );
};
// Función para obtener todas las categorías activas
const getCategorysData = (callBack) => {
  pool.query(
    `select * from categorias WHERE estado_cate=1`,
    [],
    (error, results, fields) => {
      if (error) {
        return callBack(error);
      }
      return callBack(null, results);
    }
  );
};
// Función para obtener una categoría por su ID
const getCategorysById = (id_cate, callBack) => {
  pool.query(
    `select * from categorias where id_cate = ? AND estado_cate=1`,
    [id_cate],
    (error, results, fields) => {
      if (error) {
        return callBack(error);
      }
      return callBack(null, results[0]);
    }
  );
};
// Función para actualizar una categoría por su ID
const updateCategorys = (id_cate, data, callBack) => {
  pool.query(
    `update categorias set nom_cate=?, desc_cate=? where id_cate=?`,
    [data.nom_cate, data.desc_cate, id_cate],
    (error, results, fields) => {
      if (error) {
        return callBack(error);
      }
      return callBack(null, results[0]);
    }
  );
};
// Función para marcar una categoría como inactiva por su ID
const deleteCategorys = (id_cate, callBack) => {
  pool.query(
    `update categorias set estado_cate=? where id_cate=?`,
    [0, id_cate],
    (error, results, fields) => {
      if (error) {
        return callBack(error);
      }
      return callBack(null, results[0]);
    }
  );
};
// Exporta las funciones del módulo
module.exports = {
  createCategorys,
  getCategorysData,
  getCategorysById,
  updateCategorys,
  deleteCategorys,
};
