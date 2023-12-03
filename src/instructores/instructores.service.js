const pool = require("../config/database");

const createInstuctores = (data, callBack) => {
  console.log("DATA : ", data);
  pool.query(
    `insert into autoridades(ced_inst,nom_pat_inst, nom_mat_inst, ape_pat_inst, ape_mat_inst, telf_inst, dir_inst, ciud_inst,tit_inst, puesto_inst, url_firma) values(?,?,?,?,?,?,?,?,?,?,?)`,
    [
      data.ced_inst,
      data.nom_pat_inst,
      data.nom_mat_inst,
      data.ape_pat_inst,
      data.ape_mat_inst,
      data.telf_inst,
      data.dir_inst,
      data.ciud_inst,
      data.tit_inst,
      data.puesto_inst,
      data.url_firma,
    ],
    (error, results, fields) => {
      if (error) {
        return callBack(error);
      }
      return callBack(null, results);
    }
  );
};
const getInstructorsData = (callBack) => {
  pool.query(`select * from autoridades`, [], (error, results, fields) => {
    if (error) {
      return callBack(error);
    }
    return callBack(null, results);
  });
};

const getInstructorByCed = (ced_inst) => {
  pool.query(
    `select * from autoridades where ced_inst=?`,
    [ced_inst],
    (error, results, fields) => {
      if (error) {
        return callBack(error);
      }
      return callBack(null, results[0]);
    }
  );
};
const updateInstructores = (ced_inst, data, callBack) => {
  pool.query(
    `update autoridades set nom_pat_inst=?, nom_mat_inst=?, ape_pat_inst=?, ape_mat_inst=?, telf_inst=?, dir_inst=?, ciud_inst=?,tit_inst=?, puesto_inst=?, url_firma=? where ced_inst=?`,
    [
      data.nom_pat_inst,
      data.nom_mat_inst,
      data.ape_pat_inst,
      data.ape_mat_inst,
      data.telf_inst,
      data.dir_inst,
      data.ciud_inst,
      data.tit_inst,
      data.puesto_inst,
      data.url_firma,
      ced_inst,
    ],
    (error, results, fields) => {
      if (error) {
        return callBack(error);
      }
      return callBack(null, results);
    }
  );
};

const deleteInstructors = (ced_inst, callBack) => {
  pool.query(
    `delete from autoridades where ced_inst=?`,
    [ced_inst],
    (error, results, fields) => {
      if (error) {
        return callBack(error);
      }
      return callBack(null, results[0]);
    }
  );
};
module.exports = {
  createInstuctores,
  updateInstructores,
  getInstructorsData,
  getInstructorByCed,
  deleteInstructors,
};
