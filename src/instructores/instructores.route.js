// Importa el módulo de enrutamiento de Express
const routerInstructores = require("express").Router();
// Importa el módulo de multer para la manipulación de archivos
const multer = require("multer");
// Configura multer para almacenar los archivos en la memoria
const upload = multer({ storage: multer.memoryStorage() });
// Importa la función de verificación de token desde el módulo de autenticación
const { checkToken } = require("../auth/token.js");
// Importa las funciones del controlador de instructores
const {
  registerInstructor,
  updateInstructor,
  getInstructors,
  getInstructor,
  deleteInstructor,
} = require("./instructores.controller.js");
routerInstructores.post(
  "/",

  upload.single("url_firma"),
  registerInstructor
);
routerInstructores.put(
  "/:ced_inst",

  upload.single("url_firma"),
  updateInstructor
);
// Rutas para las operaciones CRUD de instructores
routerInstructores.get("/", getInstructors);
routerInstructores.get("/:ced_inst", getInstructor);
routerInstructores.delete("/:ced_inst", deleteInstructor);
// Exporta el enrutador para su uso en otros archivos

module.exports = routerInstructores;
