const pool = require("../config/database");

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
module.exports = {
  getUserByUser,
};
