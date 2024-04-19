const updateRouter = require("express").Router();
const fileUpload = require("multer");
const { createStorage } = require("../utils/multer");
const {avatarValidator} = require("../middleware/avatarValidator");
const { updateController } = require("../controller/update");
const { updateUserValidator } = require("../middleware/updateUserValidator");
const { authToken } = require("../middleware/authToken");
const avatarStorage = fileUpload({storage: createStorage("images"), limits: {fileSize: Math.round(3 * (1024 * 1024))}});

updateRouter.route("/user/:userId").put(authToken, avatarStorage.single("avatar"), avatarValidator, updateUserValidator,  updateController.user.PUT)

module.exports = {updateRouter};