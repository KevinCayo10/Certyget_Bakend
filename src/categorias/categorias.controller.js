const {
  getCategorysData,
  createCategorys,
  getCategorysById,
  updateCategorys,
  deleteCategorys,
} = require("./categorias.service");
// Función para crear una nueva categoría
const createCategory = (req, res) => {
  const body = req.body;
  // Llama a la función de servicio para crear una categoría
  createCategorys(body, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(500).json({
        success: 0,
        message: "Database connection error",
      });
    }
    // Si la operación es exitosa, responde con los resultados
    return res.status(200).json({
      success: 1,
      data: results,
    });
  });
};
// Función para obtener todas las categorías
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
// Función para obtener una categoría por ID

const getCategory = (req, res) => {
  const id_cate = req.params.id_cate;
  // Llama a la función de servicio para obtener una categoría por ID
  getCategorysById(id_cate, (err, results) => {
    if (err) {
      console.log(err);
      return;
    }
    // Si no hay resultados, responde con un mensaje indicando que no se encontró el registro
    if (!results) {
      return res.json({
        success: 0,
        message: "Record not Found",
      });
    }
    // Responde con los resultados obtenidos
    return res.json({
      success: 1,
      data: results,
    });
  });
};
// Función para actualizar una categoría por ID
const updateCategory = (req, res) => {
  const body = req.body;
  const id_cate = req.params.id_cate;
  // Llama a la función de servicio para actualizar una categoría por ID
  updateCategorys(id_cate, body, (err, results) => {
    if (err) {
      console.log(err);
      return;
    }
    // Responde con un mensaje indicando que la actualización fue exitosa
    return res.json({
      success: 1,
      message: "updated successfully",
    });
  });
};
// Función para eliminar una categoría por ID
const deleteCategory = (req, res) => {
  const id_cate = req.params.id_cate;
  // Llama a la función de servicio para eliminar una categoría por ID
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
    // Responde con un mensaje indicando que la categoría se eliminó correctamente
    return res.json({
      success: 1,
      message: "Categoria deleted successfully",
    });
  });
};
// Exporta las funciones del controlador
module.exports = {
  createCategory,
  getCategory,
  getCategorys,
  updateCategory,
  deleteCategory,
};
