const storage = require("../config/gcloud");
const {
  createInstuctores,
  deleteInstructors,
  getInstructorsData,
  updateInstructores,
  getInstructorByCed,
} = require("./instructores.service");
const multer = require("multer");
// Configura el bucket de almacenamiento en Google Cloud utilizando el módulo importado

const bucket = storage.bucket(`${process.env.BUCKET_NAME}`);
// Importa la función UUID del módulo uuid

const { v4: uuidv4 } = require("uuid");
// Función para generar un ID único utilizando UUID

function generateUniqueId() {
  return uuidv4();
}
// Función para registrar un instructor

const registerInstructor = async (req, res) => {
  try {
    //Verficar si existe el archivo
    const body = req.body;

    if (!body) {
      return res
        .status(400)
        .send({ success: 0, message: "Please there are not data" });
    }

    if (!req.file) {
      return res
        .status(400)
        .send({ success: 0, message: "Please upload a file!" });
    }

    const fileExtension = req.file.originalname.split(".").pop();
    const fileName = `${body.ced_inst}_${generateUniqueId()}.${fileExtension}`;
    const file = bucket.file(`firmas_autoridades/${body.ced_inst}/${fileName}`);
    // Subir archivo al bucket utilizando un buffer
    await file.save(req.file.buffer, {
      resumable: false,
      contentType: req.file.mimetype, // Asegúrate de que el mimetype sea correcto
    });

    // Hacer el archivo público
    try {
      await file.makePublic();
    } catch (error) {
      console.error("Error al hacer público el archivo:", error);
      return res.status(500).send({
        message: `Uploaded the file successfully: ${fileName}, but public access is denied!`,
        url: file.publicUrl(),
      });
    }
    //Guardar toda la información en la base de datos
    body.url_firma = file.publicUrl();
    createInstuctores(body, (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          success: 0,
          message: "Database connection errror",
        });
      }
      return res.status(200).json({
        success: 1,
        data: results,
      });
    });
  } catch (error) {
    console.error("Error en el servidor:", error);
    res.status(500).send({ message: "Error en el servidor." });
  }
};
// Función para obtener todos los instructores

const getInstructors = (req, res) => {
  getInstructorsData((err, results) => {
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
// Función para obtener un instructor por su cédula

const getInstructor = (req, res) => {
  const ced_inst = req.params.ced_inst;
  getInstructorByCed(ced_inst, (err, results) => {
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
// Función para actualizar la información de un instructor

const updateInstructor = async (req, res) => {
  try {
    //Verficar si existe el archivo
    const body = req.body;
    console.log("INST : ", body);
    console.log("INST FILE  : ", req.file);

    const ced_inst = req.params.ced_inst;
    if (!body) {
      return res
        .status(400)
        .send({ success: 0, message: "Please there are not data" });
    }

    if (!ced_inst) {
      return res
        .status(400)
        .send({ success: 0, message: "Please there is not ced_inst" });
    }
    if (req.file) {
      const fileExtension = req.file.originalname.split(".").pop();
      const fileName = `${ced_inst}_${generateUniqueId()}.${fileExtension}`;
      const file = bucket.file(`firmas_autoridades/${ced_inst}/${fileName}`);
      console.log("FILE : ", file);
      // Subir archivo al bucket utilizando un buffer
      await file.save(req.file.buffer, {
        resumable: false,
        contentType: req.file.mimetype, // Asegúrate de que el mimetype sea correcto
      });

      // Hacer el archivo público
      try {
        await file.makePublic();
      } catch (error) {
        console.error("Error al hacer público el archivo:", error);
        return res.status(500).send({
          message: `Uploaded the file successfully: ${fileName}, but public access is denied!`,
          url: file.publicUrl(),
        });
      }
      //Guardar toda la información en la base de datos
      body.url_firma = file.publicUrl();
    }
    // Actualiza la información del instructor en la base de datos

    updateInstructores(ced_inst, body, (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          success: 0,
          message: "Database connection errror",
        });
      }
      return res.status(200).json({
        success: 1,
        data: results,
      });
    });
  } catch (error) {
    console.error("Error en el servidor:", error);
    res.status(500).send({ message: "Error en el servidor." });
  }
};
// Función para eliminar un instructor por su cédula

const deleteInstructor = (req, res) => {
  const ced_inst = req.params.ced_inst;
  deleteInstructors(ced_inst, (err, results) => {
    if (err) {
      console.log(err);
      return;
    }
    return res.json({
      success: 1,
      message: "Instructor deleted successfully",
    });
  });
};
// Exporta las funciones para su uso en otros archivos

module.exports = {
  registerInstructor,
  deleteInstructor,
  getInstructors,
  getInstructor,
  updateInstructor,
};
