const fs = require("fs");
const path = require("path");

const updateController = {
  user: {
    PUT: (req, res) => {
      const { findUser, newUser } = req.updateUser();
      if (req.file) {
        fs.unlinkSync(
          path.join(process.cwd(), "src", "assets", "images", findUser.avatar)
        );
      }
      res
        .status(200)
        .json({
          message: "The user successfull updated",
          statusCode: 200,
          user: newUser,
        });
    },
  },
};
module.exports = { updateController };
