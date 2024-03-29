const { response } = require("express");
const storage = require("../config/gcloud");
const {
  createCursos,
  createPlantillaCerPromise,
  createCursosPromise,
  createDetalleCursos,
  getCursosData,
  deleteCursoInDetalleCursos,
  updateCursosByCursos,
  deleteCursoByIdCursos,
} = require("./cursos.service");
const multer = require("multer");

const bucket = storage.bucket(`${process.env.BUCKET_NAME}`);
const { v4: uuidv4 } = require("uuid");

function generateUniqueId() {
  return uuidv4();
}

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
    const fileName = `${body.nom_cur}_${generateUniqueId()}.${fileExtension}`;
    const file = bucket.file(
      `plantilla_cursos/${body.id_cate_cur}/${fileName}`
    );
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
    body.url_cer = file.publicUrl();
    //1ro Registrar la plantilla
    //2do Registrar el curso
    const id_cur = await createCursosPromise(body);
    const ced_inst_array = (body.ced_inst || "").split(",").map(Number); // Dividir la cadena y convertir a números
    console.log("CED ARRAY : ", ced_inst_array);
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
    /*
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
    });
    return res.status(200).json({
      success: 1,
      data: results,
    });
    */
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: 0,
      message: "Error",
    });
  }
};

const updateCurso = async (req, res) => {
  const body = req.body;
  const id_cur = req.params.id_cur;
  console.log("CURSO : ", body);
  console.log("CURSO FILE  : ", req.file);
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
  if (req.file) {
    console.log("ENTRO IF REQ.FILE");
    const fileExtension = req.file.originalname.split(".").pop();
    const fileName = `${body.nom_cur}_${generateUniqueId()}.${fileExtension}`;
    const file = bucket.file(
      `plantilla_cursos/${body.id_cate_cur}/${fileName}`
    );
    console.log("FILE : ", file);

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
    console.log("FILE.PUBLICURL() : ", file.publicUrl());
    body.url_cer = file.publicUrl();
    console.log("PUBLIC URL : ", body.url_cer);
    console.log("BODY dentro IF : ", body);
  }

  //1ro Registrar la plantilla

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

  console.log("CED_INST_ARRAY : ", ced_inst_array);
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
const getCursos = (req, res) => {
  getCursosData((err, results) => {
    if (err) {
      console.log(err);
      return;
    }

    // Procesar resultados para convertir id_instructores en un array
    // Procesar  para convertir id_instructores en un array
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

const deleteCursos = (req, res) => {
  const id_cur = req.params.id_cur;

  /*deleteCursoInDetalleCursos(id_cur, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(500).json({
        success: 0,
        message: "Database connection errror",
      });
    }
  });*/
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

module.exports = {
  createCurso,
  getCursos,
  updateCurso,
  deleteCursos,
  deleteCursos,
};
