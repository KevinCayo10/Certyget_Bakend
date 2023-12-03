const { sign } = require("jsonwebtoken");
const {
  create,
  getUserByUser,
  getUserData,
  getUserById,
  updateUser,
  deleteUser,
} = require("./user.service");
const { genSaltSync, hashSync, compareSync } = require("bcrypt");

const createUser = (req, res) => {
  const body = req.body;
  const salt = genSaltSync(10);
  body.pass_usu = hashSync(body.pass_usu, salt);
  create(body, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(500).json({
        success: 0,
        message: "Database connection errror",
      });
    }
    return res.status(200).json({
      success: 1,
      data: results,
    });
  });
};
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

const getUsers = (req, res) => {
  getUserData((err, results) => {
    if (err) {
      console.log(err);
      return;
    }
    return res.json({
      success: 1,
      data: results,
    });
  });
};

const getUser = (req, res) => {
  const id_usu = req.params.id_usu;
  getUserById(id_usu, (err, results) => {
    if (err) {
      console.log(err);
      return;
    }
    if (!results) {
      return res.json({
        success: 0,
        message: "Record not Found",
      });
    }
    return res.json({
      success: 1,
      data: results,
    });
  });
};

const updateUsers = (req, res) => {
  const body = req.body;
  const id_usu = req.params.id_usu;
  const salt = genSaltSync(10);
  body.pass_usu = hashSync(body.pass_usu, salt);
  updateUser(id_usu, body, (err, results) => {
    if (err) {
      console.log(err);
      return;
    }
    return res.json({
      success: 1,
      message: "updated successfully",
    });
  });
};

const deleteUsers = (req, res) => {
  const id_usu = req.params.id_usu;
  deleteUser(id_usu, (err, results) => {
    if (err) {
      console.log(err);
      return;
    }
    /* if (!results) {
      return res.json({
        success: 0,
        message: "Record not found",
      });
    }*/
    return res.json({
      success: 1,
      message: "user deleted successfully",
    });
  });
};
module.exports = {
  login,
  createUser,
  getUsers,
  getUser,
  updateUsers,
  deleteUsers,
};
