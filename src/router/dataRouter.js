const dataRouter = require("express").Router();
const {dataController} = require("../controller/dataController");
const { authToken } = require("../middleware/authToken");

dataRouter.route("/movies").get(authToken, dataController.GET);
dataRouter.route("/avatar/:userId").get(authToken , dataController.avatar.GET);

module.exports = {dataRouter}