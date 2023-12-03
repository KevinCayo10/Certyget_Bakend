const { sign } = require("jsonwebtoken");
const { getUserByUser } = require("./user.service");
const { genSaltSync, hashSync, compareSync } = require("bcrypt");
const login = (req, res) => {
  const body = req.body;
  const user_usu = body.user_usu;
  getUserByUser(user_usu, (err, results) => {
    if (err) {
      console.log(err);
    }
    if (!results) {
      return res.json({
        success: 0,
        data: "Invalid correo or password",
      });
    }

    const result = compareSync(body.pass_usu.trim(), results.pass_usu);
    console.log("RESULT", result);

    if (result) {
      result.pass_usu = undefined;
      const jsontoken = sign({ result: result }, process.env.JWT_KEY, {
        expiresIn: "1h",
      });
      return res.json({
        success: 1,
        message: "login successfully",
        token: jsontoken,
      });
    } else {
      return res.json({
        success: 0,
        data: "Invalid email or contrasena",
      });
    }
  });
};
module.exports = {
  login,
};
