require("dotenv").config();
const express = require("express");
const cors = require("cors");
const pool = require("./src/config/database");
const { route } = require("./src/users/user.route");
const routerUser = require("./src/users/user.route");
const routerCategory = require("./src/categorias/categorias.route");
const routerInstructores = require("./src/instructores/instructores.route");
const routerCursos = require("./src/cursos/cursos.route");
const routerCertificados = require("./src/certificados/certificados.route");
const app = express();

app.use(express.json());
app.use(cors());
// For pool initialization, see above

pool.getConnection((err, connection) => {
  if (err) {
    console.error("Error al obtener una conexión del pool:", err);
    return;
  }
  console.log("Conexión exitosa a la base de datos");
});
app.use("/api/users", routerUser);
app.use("/api/category", routerCategory);
app.use("/api/instructor", routerInstructores);
app.use("/api/cursos", routerCursos);
app.use("/api/certificados", routerCertificados);

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log("server up and running on PORT :", port);
});
