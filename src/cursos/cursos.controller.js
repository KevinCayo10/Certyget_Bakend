const { response } = require("express");
const storage = require("../config/gcloud");
const path = require("path");
const fs = require("fs");

const {
  createCursosPromise,
  createDetalleCursos,
  getCursosData,
  deleteCursoInDetalleCursos,
  updateCursosByCursos,
  deleteCursoByIdCursos,
} = require("./cursos.service");
const multer = require("multer");
const { replaceInvalidChars } = require("../utils/invalidChars");
// Crea una instancia del bucket de Google Cloud Storage

// const bucket = storage.bucket(`${process.env.BUCKET_NAME}`);

const storageConfig = multer.diskStorage({
  destination: (req, file, cb) => {
    const plantillaCursosFolder = path.join(
      __dirname,
      "../../images/plantilla_cursos"
    );
    const nomCurFormatted = replaceInvalidChars(req.body.nom_cur.toString());

    const idCurFolder = path.join(plantillaCursosFolder, nomCurFormatted);

    // Crea las carpetas si no existen
    if (file) {
      fs.mkdirSync(plantillaCursosFolder, { recursive: true });
      fs.mkdirSync(idCurFolder, { recursive: true });
    }

    cb(null, idCurFolder);
  },
  filename: (req, file, cb) => {
    if (file) {
      const fileExtension = file.originalname.split(".").pop();
      const nomCurFormatted = replaceInvalidChars(req.body.nom_cur.toString());
      const fileName = `${nomCurFormatted}_${Date.now()}.${fileExtension}`;
      cb(null, fileName);
    } else {
      cb(new Error("No file provided"), null);
    }
  },
});

const upload = multer({ storage: storageConfig }).single("url_cer");

// Controlador para crear un nuevo curso

const createCurso = async (req, res) => {
  console.log(req.body);
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
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Puedes ajustar el tiempo según sea necesario

    const fileName = req.file.filename; // Obtén el nombre del archivo generado automáticamente
    const nomCurFormatted = replaceInvalidChars(req.body.nom_cur.toString());

    // Construye la URL completa de la imagen
    const imageUrl = `${process.env.URL_SERVER}/images/plantilla_cursos/${nomCurFormatted}/${fileName}`;

    // Guarda la URL en el cuerpo de la respuesta o en la base de datos
    body.url_cer = imageUrl;

    const id_cur = await createCursosPromise(body);
    const ced_inst_array = (body.ced_inst || "").split(",").map(Number); // Dividir la cadena y convertir a números
    const detallePromises = ced_inst_array.map(async (ced_inst) => {
      const detalle = {
        id_cur: id_cur,
        id_inst: ced_inst,
      };
      return new Promise((resolve, reject) => {
        createDetalleCursos(detalle, (err, results) => {
          if (err) {
            reject(err);
          } else {
            resolve(results);
          }
        });
      });
    });

    // Esperar a que se completen todas las inserciones en detalle_cursos
    const detalleResults = await Promise.all(detallePromises);
    return res.status(200).json({
      success: 1,
      data: detalleResults, // Puedes devolver los resultados de cada inserción si es necesario
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: 0,
      message: "Error",
    });
  }
};
// Controlador para actualizar un curso

const updateCurso = async (req, res) => {
  const body = req.body;
  const id_cur = req.params.id_cur;
  console.log("CURSO : ", body);
  //Limpiar en el detalle_cursos
  deleteCursoInDetalleCursos(id_cur, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(500).json({
        success: 0,
        message: "Database connection errror",
      });
    }
  });
  // Si se adjunta un nuevo archivo, realiza las operaciones correspondientes
  if (req.file) {
    /*const fileExtension = req.file.originalname.split(".").pop();

    // const fileName = `${body.nom_cur}_${generateUniqueId()}.${fileExtension}`;
    const file = bucket.file(
      `plantilla_cursos/${body.id_cate_cur}/${fileName}`
    );
    // Subir archivo al bucket utilizando un buffer
    await file.save(req.file.buffer, {
      resumable: false,
      contentType: req.file.mimetype, // Asegúrate de que el mimetype sea correcto
    });
    try {
      await file.makePublic();
    } catch (error) {
      console.error("Error al hacer público el archivo:", error);
    }
    //Guardar toda la información en la base de datos
    body.url_cer = file.publicUrl();*/
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Puedes ajustar el tiempo según sea necesario

    const fileName = req.file.filename; // Obtén el nombre del archivo generado automáticamente

    // Construye la URL completa de la imagen
    const imageUrl = `${process.env.URL_SERVER}/images/plantilla_cursos/${body.nom_cur}/${fileName}`;

    // Guarda la URL en el cuerpo de la respuesta o en la base de datos
    body.url_cer = imageUrl;
  }

  // body.estado_cur = body.estado_cur ? 1 : 0;
  updateCursosByCursos(id_cur, body, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(500).json({
        success: 0,
        message: "Database connection errror",
      });
    }
  });

  const ced_inst_string = body.ced_inst || "";
  const ced_inst_array = (ced_inst_string.match(/\d+/g) || []).map(Number);

  const detallePromises = ced_inst_array.map(async (ced_inst) => {
    const detalle = {
      id_cur: id_cur,
      id_inst: ced_inst,
    };
    console.log("detalle ; ", detalle);
    return new Promise((resolve, reject) => {
      createDetalleCursos(detalle, (err, results) => {
        if (err) {
          reject(err);
        } else {
          console.log("RESULT : ", results);
          resolve(results);
        }
      });
    });
  });
  // Esperar a que se completen todas las inserciones en detalle_cursos
  const detalleResults = await Promise.all(detallePromises);
  return res.status(200).json({
    success: 1,
    data: detalleResults, // Puedes devolver los resultados de cada inserción si es necesario
  });
};
// Controlador para obtener la información de todos los cursos
const getCursos = (req, res) => {
  getCursosData((err, results) => {
    if (err) {
      console.log(err);
      return;
    }

    const cursosConInstructores = results.map((curso) => ({
      ...curso,
      ced_inst:
        curso.ced_inst && curso.ced_inst.includes(",")
          ? curso.ced_inst.split(",").map(Number)
          : [Number(curso.ced_inst)],
    }));

    return res.json({
      success: 1,
      data: cursosConInstructores,
    });
  });
};
// Controlador para eliminar un curso
const deleteCursos = (req, res) => {
  const id_cur = req.params.id_cur;

  deleteCursoByIdCursos(id_cur, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(500).json({
        success: 0,
        message: "Database connection errror",
      });
    }
  });
  return res.status(200).json({
    success: 1,
    message: "Curso eliminado",
  });
};
// Exporta los controladores para su uso en otras partes de la aplicación

module.exports = {
  createCurso,
  getCursos,
  updateCurso,
  deleteCursos,
  deleteCursos,
  upload,
};
