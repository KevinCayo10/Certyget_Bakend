// Importa el módulo 'dotenv' para cargar las variables de entorno desde un archivo .env
require("dotenv").config();
// Importa las bibliotecas necesarias
const express = require("express");
const cors = require("cors");
const pool = require("./src/config/database");
const { route } = require("./src/users/user.route");
// Importa los enrutadores
const routerUser = require("./src/users/user.route");
const routerCategory = require("./src/categorias/categorias.route");
const routerInstructores = require("./src/instructores/instructores.route");
const routerCursos = require("./src/cursos/cursos.route");
const routerCertificados = require("./src/certificados/certificados.route");
// Crea una instancia de la aplicación Express
const app = express();
// Configura la aplicación para usar JSON y CORS
app.use(express.json());
app.use(cors());

// Establece una conexión inicial con la base de datos
pool.getConnection((err, connection) => {
  if (err) {
    console.error("Error al obtener una conexión del pool:", err);
    return;
  }
  console.log("Conexión exitosa a la base de datos");
});
// Configura los enrutadores para sus respectivas rutas
app.use("/api/users", routerUser);
app.use("/api/category", routerCategory);
app.use("/api/instructor", routerInstructores);
app.use("/api/cursos", routerCursos);
app.use("/api/certificados", routerCertificados);
// Configura el puerto del servidor, utilizando el proporcionado en las variables de entorno o el puerto 4000 por defecto
const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log("server up and running on PORT :", port);
});
// Ruta de prueba para verificar el funcionamiento básico del servidor
app.get("/", (req, res) => {
  res.json("HELLO WORDL");
});
