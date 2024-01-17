// Importa la biblioteca 'jsonwebtoken'
const jwt = require("jsonwebtoken");
// Exporta un objeto con un método llamado 'checkToken'
module.exports = {
  // Middleware para verificar el token en la cabecera de la solicitud
  checkToken: (req, res, next) => {
    // Imprime en consola el valor de la cabecera 'authorization' de la solicitud
    console.log(req.get("authorization"));
    // Obtiene el token de la cabecera 'authorization'
    let token = req.get("authorization");
    // Verifica si el token existe
    if (token) {
      // Elimina la palabra 'Bearer' del token (si presente)
      token = token.slice(7);
      console.log("TOKEN : ", token);
      // Verifica la validez del token utilizando la clave secreta (process.env.JWT_KEY)
      jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
        if (err) {
          // Si hay un error en la verificación del token, responde con un mensaje de error
          return res.json({
            success: 0,
            message: "Invalid Token...",
          });
        } else {
          // Si la verificación es exitosa, adjunta los datos decodificados al objeto 'req' y pasa al siguiente middleware
          req.decoded = decoded;
          console.log("decoded : ", req.decoded);
          next();
        }
      });
    } else {
      // Si no se proporciona un token en la cabecera, responde con un mensaje de acceso denegado
      return res.json({
        success: 0,
        message: "Access Denied! Unauthorized User",
      });
    }
  },
};
