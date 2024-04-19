const fs = require("fs");
const path = require("path");
const videoController = {
    POST: (req, res) => {
        try{
            const videos = req.getData("videos");
            const {videoTitle} = req.body;
            const {filename} = req.file;
            let videoData = {
                videoName: filename,
                videoTitle,
                createAt: new Date(),
                videoId: videos?.length ? videos[videos.length-1].videoId + 1: 1
            };
            videos.push(videoData);   
            req.writeData("videos", videos)
            return res.status(201).json({message: "The video succcessfull created !", statusCode: 201});
        }catch(error){
            return res.json({message: error.message})
        }
    },
    GET: function(req, res) {
        try{
            const videos = req.getData("videos");
            if(Object.keys(req.params).length){
                const {videoId} = req.params;
                let video = req.sendVideo(videoId);
                res.send(video);
            };
            if(Object.keys(req.query).length && req.query.hasOwnProperty("videoId") ){ 
                const video = req.sendVideo(req.query.videoId);
                res.send(video);
            };
            return res.status(200).json(videos)
        }catch(error){
            return res.status(error.status || 400).json({message: error.message, statusCode: error.status || 400});
        }
    }
}

module.exports = {videoController}