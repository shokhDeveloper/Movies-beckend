const userRouter = require("express").Router();
const {userController} = require("../controller/user");
const { authToken } = require("../middleware/authToken");
userRouter.route("/").get(authToken, userController.GET);
userRouter.route("/:userId").get(authToken, userController.GET);
module.exports = {userRouter}