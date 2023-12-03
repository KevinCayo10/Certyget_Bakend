const pool = require("../config/database");

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

const getUserData = (callBack) => {
  pool.query(`select * from usuarios`, [], (error, results, fields) => {
    if (error) {
      return callBack(error);
    }
    console.log("RES :", results);
    return callBack(null, results);
  });
};

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
module.exports = {
  getUserByUser,
  create,
  getUserData,
  getUserById,
  updateUser,
  deleteUser,
};
