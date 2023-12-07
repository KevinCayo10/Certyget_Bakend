const routerInstructores = require("express").Router();
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

const { checkToken } = require("../auth/token.js");
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
routerInstructores.get("/", getInstructors);
routerInstructores.get("/:ced_inst", getInstructor);
routerInstructores.delete("/:ced_inst", deleteInstructor);

module.exports = routerInstructores;
