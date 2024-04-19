const fs = require("fs");
const pathModule = require("path");
const { ClientError } = require("../utils/error");
const avatarSaveValidator = function(req, res, next){
    if(req.file){
        const {originalname, path, size} = req.file;
        try{
            if(3 * (1024 * 1024) < size ) throw new ClientError(413, "Avatar size is larger than 3 mb");
            const imageExtNames = [".png", ".jpeg", ".jpg"];
            const avatarExtName = pathModule.extname(originalname);
            if(!imageExtNames.includes(avatarExtName)) throw new ClientError(415, "The avatar its invalid ! possible avatar formats: (png, jpeg | jpg)");
            return next()
        }catch(error){
            if(path && originalname){
                fs.unlinkSync(path)
                return res.status(error.status).json({message: error.message, statusCode: error.status, invalidAvatar: originalname, maximumSize: "3mb" })   
            }else{
                return next()
            }
        }
    }else{
        return next()
    }
}

module.exports = { avatarValidator: avatarSaveValidator };