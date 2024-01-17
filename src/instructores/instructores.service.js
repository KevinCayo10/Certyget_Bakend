// Importa el módulo de conexión a la base de datos
const pool = require("../config/database");
// Función para crear instructores en la base de datos

const createInstuctores = (data, callBack) => {
  console.log("DATA : ", data);
  pool.query(
    `insert into autoridades(ced_inst,nom_pat_inst, nom_mat_inst, ape_pat_inst, ape_mat_inst, telf_inst, dir_inst, ciud_inst,tit_inst, puesto_inst, url_firma,estado_inst) values(?,?,?,?,?,?,?,?,?,?,?,?)`,
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
      1,
    ],
    (error, results, fields) => {
      if (error) {
        return callBack(error);
      }
      return callBack(null, results);
    }
  );
};
// Función para obtener datos de todos los instructores activos
const getInstructorsData = (callBack) => {
  pool.query(
    `select * from autoridades WHERE estado_inst = 1`,
    [],
    (error, results, fields) => {
      if (error) {
        return callBack(error);
      }
      return callBack(null, results);
    }
  );
};
// Función para obtener un instructor por su cédula

const getInstructorByCed = (ced_inst) => {
  pool.query(
    `select * from autoridades where ced_inst=? and estado_inst = 1`,
    [ced_inst],
    (error, results, fields) => {
      if (error) {
        return callBack(error);
      }
      return callBack(null, results[0]);
    }
  );
};
// Función para actualizar información de instructores
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
// Función para desactivar un instructor

const deleteInstructors = (ced_inst, callBack) => {
  pool.query(
    `update autoridades set estado_inst=? where ced_inst=?`,
    [0, ced_inst],
    (error, results, fields) => {
      if (error) {
        return callBack(error);
      }
      return callBack(null, results[0]);
    }
  );
};

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
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: 0,
      message: "Error",
    });
  }
};
// Exporta las funciones para su uso en otros archivos
module.exports = {
  createInstuctores,
  updateInstructores,
  getInstructorsData,
  getInstructorByCed,
  deleteInstructors,
};
