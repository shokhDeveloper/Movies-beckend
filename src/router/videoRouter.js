const videoRouter = require("express").Router();
const {createStorage} = require("../utils/multer");
const {videoController} = require("../controller/video");
const {videoValidator} = require("../middleware/videoValidator");
const fileUpload = require("multer");

const videoStorage = fileUpload({storage: createStorage("videos"), limits:{fileSize: 50 * (1024 * 1024)}});

videoRouter.route("/upload").post(videoStorage.single("video"), videoValidator, videoController.POST)

module.exports = {videoRouter};