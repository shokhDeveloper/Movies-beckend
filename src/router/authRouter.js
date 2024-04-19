const authRouter = require("express").Router();
const {authController} = require("../controller/auth");
const {createStorage} = require("../utils/multer");
const {avatarValidator} = require("../middleware/avatarValidator")
const fileUpload = require("multer");
const { adminController } = require("../controller/admin");

const avatarStorage = fileUpload({storage: createStorage("images"), limits: {fileSize: Math.round(3 * (1024 * 1024))}});

authRouter.route("/admin").post(adminController.POST);
authRouter.route("/register").post(avatarStorage.single("avatar"), avatarValidator, authController.REGISTER);
authRouter.route("/login").post(authController.LOGIN);

module.exports = {authRouter}