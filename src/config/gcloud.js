// Importa la clase 'Storage' del módulo '@google-cloud/storage'
const { Storage } = require("@google-cloud/storage");
// Importa el módulo 'dotenv' para cargar las variables de entorno desde un archivo '.env'
require("dotenv").config();
// Crea una instancia de 'Storage' con la configuración proporcionada en las variables de entorno
const storage = new Storage({
  projectId: process.env.PROJECT_ID,
  keyFilename: process.env.KEY_FILENAME,
});
// Exporta la instancia de 'Storage' para su uso en otras partes de la aplicación
module.exports = storage;
