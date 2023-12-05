const storage = require("../config/gcloud");
const {
  createCursos,
  createPlantillaCerPromise,
  createCursosPromise,
  createDetalleCursos,
  getCursosData,
} = require("./cursos.service");
const multer = require("multer");

const bucket = storage.bucket(`${process.env.BUCKET_NAME}`);

const createCurso = async (req, res) => {
  try {
    const body = req.body;
    if (!body) {
      return res
        .status(400)
        .send({ success: 0, message: "Please there are not data" });
    }
    console.log("file : ", req.file);
    if (!req.file) {
      return res
        .status(400)
        .send({ success: 0, message: "Please upload a file!" });
    }
    const fileExtension = req.file.originalname.split(".").pop();
    const fileName = `${body.nom_cur}.${fileExtension}`;
    const file = bucket.file(`plantilla_cursos/${fileName}`);
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
    }
    //Guardar toda la información en la base de datos
    const url_firma = file.publicUrl();
    //1ro Registrar la plantilla
    body.id_cur_cer = await createPlantillaCerPromise(url_firma);
    //2do Registrar el curso
    const id_cur = await createCursosPromise(body);
    const detalle = {
      id_cur: id_cur,
      id_inst: body.ced_inst,
    };
    //3ro Registrar el detalle
    createDetalleCursos(detalle, (err, results) => {
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
    console.log(error);
    return res.status(500).json({
      success: 0,
      message: "Error",
    });
  }
};

const getCursos = (req, res) => {
  getCursosData((err, results) => {
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

module.exports = {
  createCurso,
  getCursos,
};
