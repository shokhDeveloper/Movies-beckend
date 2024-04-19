 const sha256 = require("sha256")
const { ClientError } = require("../utils/error");
const { launchToken } = require("../utils/jwt");
const { adminValidator } = require("../utils/validator");

const adminController = {
  POST: function (req, res) {
    try {
      const admin = req.getData("admin");
      const adminValues = req.body;
      if (!adminValues || adminValidator.validate(adminValues).error instanceof Error) throw new ClientError(400, adminValidator.validate(adminValues).error);
      else {
        const adminType = Object.keys(admin).every((key) => key == "password"? admin[key] == sha256(adminValues[key]): admin[key] == adminValues[key]);
        if(!adminType) throw new ClientError(400, "Username and password is required ! Or the values are entered incorrectly ! ")
        else return res.json({accessToken: launchToken.sign({admin: true, userAgent: req.headers["user-agent"]}), message: "Admin successfull logined", user: {...adminValues, admin: true}, statusCode: 200});
    }
    } catch (error) {
      return res.status(error?.status ? error.status : 400).json({ message: error.message, status: error.status ? error.status : 400 });
    }
  },
};

module.exports = { adminController };