// Importa el módulo de conexión a la base de datos
const pool = require("../config/database");
// Crea un nuevo usuario en la base de datos

const create = (data, callBack) => {
  pool.query(
    `insert into usuarios(user_usu, pass_usu, rol_usu) 
                values(?,?,?)`,
    [data.user_usu, data.pass_usu, data.rol_usu],
    (error, results, fields) => {
      if (error) {
        callBack(error);
      }
      return callBack(null, results);
    }
  );
};
// Obtiene un usuario por su nombre de usuario

const getUserByUser = (user_usu, callBack) => {
  pool.query(
    `select * from usuarios where user_usu = ?`,
    [user_usu],
    (error, results, fields) => {
      if (error) {
        return callBack(error);
      }
      return callBack(null, results[0]);
    }
  );
};
// Obtiene todos los usuarios en la base de datos

const getUserData = (callBack) => {
  pool.query(`select * from usuarios`, [], (error, results, fields) => {
    if (error) {
      return callBack(error);
    }
    console.log("RES :", results);
    return callBack(null, results);
  });
};
// Obtiene un usuario por su ID

const getUserById = (id_usu, callBack) => {
  pool.query(
    `select * from usuarios where id_usu = ?`,
    [id_usu],
    (error, results, fields) => {
      if (error) {
        return callBack(error);
      }
      return callBack(null, results[0]);
    }
  );
};
// Actualiza la información de un usuario en la base de datos

const updateUser = (id_usu, user, callBack) => {
  pool.query(
    `update usuarios set user_usu=?, pass_usu=?, rol_usu=? where id_usu=?`,
    [user.user_usu, user.pass_usu, user.rol_usu, id_usu],
    (error, results, fields) => {
      if (error) {
        return callBack(error);
      }
      return callBack(null, results);
    }
  );
};
// Elimina un usuario de la base de datos por su ID

const deleteUser = (id_usu, callBack) => {
  pool.query(
    `delete from usuarios where id_usu=?`,
    [id_usu],
    (error, results, fields) => {
      if (error) {
        return callBack(error);
      }
      return callBack(null, results[0]);
    }
  );
};
// Exporta las funciones para ser utilizadas en otras partes de la aplicación

module.exports = {
  getUserByUser,
  create,
  getUserData,
  getUserById,
  updateUser,
  deleteUser,
};
