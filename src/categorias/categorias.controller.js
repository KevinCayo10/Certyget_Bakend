const {
  getCategorysData,
  createCategorys,
  getCategorysById,
  updateCategorys,
  deleteCategorys,
} = require("./categorias.service");

const createCategory = (req, res) => {
  const body = req.body;
  createCategorys(body, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(500).json({
        success: 0,
        message: "Database connection error",
      });
    }
    return res.status(200).json({
      success: 1,
      data: results,
    });
  });
};

const getCategorys = (req, res) => {
  getCategorysData((err, results) => {
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

const getCategory = (req, res) => {
  const id_cate = req.params.id_cate;
  getCategorysById(id_cate, (err, results) => {
    if (err) {
      console.log(err);
      return;
    }
    if (!results) {
      return res.json({
        success: 0,
        message: "Record not Found",
      });
    }
    return res.json({
      success: 1,
      data: results,
    });
  });
};

const updateCategory = (req, res) => {
  const body = req.body;
  const id_cate = req.params.id_cate;
  updateCategorys(id_cate, body, (err, results) => {
    if (err) {
      console.log(err);
      return;
    }
    return res.json({
      success: 1,
      message: "updated successfully",
    });
  });
};

const deleteCategory = (req, res) => {
  const id_cate = req.params.id_cate;
  deleteCategorys(id_cate, (err, results) => {
    if (err) {
      console.log(err);
      return;
    }
    /* if (!results) {
      return res.json({
        success: 0,
        message: "Record not found",
      });
    } */
    return res.json({
      success: 1,
      message: "Categoria deleted successfully",
    });
  });
};
module.exports = {
  createCategory,
  getCategory,
  getCategorys,
  updateCategory,
  deleteCategory,
};
