const jwt = require("jsonwebtoken");
module.exports = {
  checkToken: (req, res, next) => {
    console.log(req.get("authorization"));
    let token = req.get("authorization");
    if (token) {
      // Remove Bearer from string
      token = token.slice(7);
      console.log("TOKEN : ", token);
      jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
        if (err) {
          return res.json({
            success: 0,
            message: "Invalid Token...",
          });
        } else {
          req.decoded = decoded;
          console.log("decoded : ", req.decoded);
          next();
        }
      });
    } else {
      return res.json({
        success: 0,
        message: "Access Denied! Unauthorized User",
      });
    }
  },
};
