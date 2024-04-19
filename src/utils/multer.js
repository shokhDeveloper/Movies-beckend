const fileUpload = require("multer");
const path = require("path");
const createStorage = (type) => {
    const fileStorage = fileUpload.diskStorage({
      destination: function(_, _, cb) {
        return cb(null, path.join(process.cwd(),  "src", "assets", type));
      },
      filename: function(_, file, cb) {
        const fileName = Date.now() + file.originalname.replaceAll(" ", "");
        return cb(null, fileName);  
      }
    });
    return fileStorage
}

module.exports = {createStorage};