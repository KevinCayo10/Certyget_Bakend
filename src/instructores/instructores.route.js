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
  checkToken,
  upload.single("url_firma"),
  registerInstructor
);
routerInstructores.put(
  "/:ced_inst",
  checkToken,
  upload.single("url_firma"),
  updateInstructor
);
routerInstructores.get("/", checkToken, getInstructors);
routerInstructores.get("/:ced_inst", checkToken, getInstructor);
routerInstructores.delete("/:ced_inst", checkToken, deleteInstructor);

module.exports = routerInstructores;
