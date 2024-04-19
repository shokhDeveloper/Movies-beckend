const adminRouter = require("express").Router();
const fileUpload = require("multer");
const { createStorage } = require("../utils/multer");
const { videoValidator } = require("../middleware/videoValidator");
const { videoController } = require("../controller/video");
const { authToken } = require("../middleware/authToken");
const videoStorage = fileUpload({storage: createStorage("videos"), limits:{
    fileSize: 50 * (1024 * 1024)
}});

adminRouter.route("/video/upload").post(authToken, videoStorage.single("video"), videoValidator, videoController.POST);
adminRouter.route("/videos").get(authToken, videoController.GET)
adminRouter.route("/video/:videoId").get(authToken, videoController.GET)
module.exports = {adminRouter};