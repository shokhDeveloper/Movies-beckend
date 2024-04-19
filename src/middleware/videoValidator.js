const fs = require("fs");
const { ClientError } = require("../utils/error");
const videoValidator = (req, res, next) => {
    try{    
        const {admin} = req.defUser;
        if(admin){
            const {mimetype} = req.file;
            const {videoTitle} = req.body;
            if(!mimetype) throw new ClientError(404 ,"Video not found");
            if(!videoTitle) throw new ClientError(400, "Video title is required !"); 
    
            const videoFormats = ["video/mp4", "video/avi", "video/mkv", "video/wmv"];
            if(!videoFormats.includes(mimetype)) throw new ClientError(415, "The video format its invalid ! possible video formats: (video/mp4, video/avi, video/mkv, video/wmv)");
            if(videoTitle.length < 3 && videoTitle.length > 16) throw new ClientError(400, "Video title is invalid !") 
            
            return next();
        }else throw new ClientError(400, "You are not an admin")
    }catch(error){
        if(req.file && req.file.path) {
            fs.unlinkSync(req.file.path);
            return res.status(error?.status ? error.status: 400).json({message: error.message})
        }else return res.status(404).json({message: "Video not found !", statusCode: 404})
    }
}

module.exports = {videoValidator};