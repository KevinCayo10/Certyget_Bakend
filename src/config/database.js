// Importa el módulo 'mysql2' para crear un pool de conexiones a la base de datos
const { createPool } = require("mysql2");
// Crea un pool de conexiones utilizando la configuración proporcionada en las variables de entorno
const pool = createPool({
  host: process.env.MYSQL_HOST,
  port: process.env.MYSQL_PORT,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  connectionLimit: 10,
});
// Exporta el pool de conexiones para su uso en otras partes de la aplicación
module.exports = pool;
