const fs = require("fs")
const path = require("path");
const { ClientError } = require("../utils/error");

const dataController = {
    GET: (req, res) => {
        try{
            const movies = req.getData("movies");
            let querys = Object.keys(req.query)
            if(querys.length){
                let searchData = req.searchData("movies");
                if(!searchData.length) return res.status(404).json({message: "Movies not found", statusCode: 404});
                const pagination = req.paginationData(searchData, querys);
                return res.status(200).json({maxPage: req.maxPage, message: "It is recommended to get data from page lip", statusCode: 200, movies:pagination});
            }else{
                return res.status(200).json({maxPage: Math.round(movies.length / req.PAGINATION.limit), message: "It is recommended to get data from page lip", statusCode: 200, movies});
            }
        }catch(error){
            return res.status(500).json({message: error.message})
        }
    },
    avatar:{
        GET: function(req, res) {
            try{
                const users = req.getData("users");
                const {userId} = req.params;
                if(!users.some(user => user.userId == userId)) throw new ClientError(404, "User not found");
                const findUser = users.find((user) => user.userId == userId);
                if(findUser){
                    const filePath = path.join(process.cwd(), "src", "assets", "images", findUser.avatar)
                    let file = fs.existsSync(filePath);
                    if(file){
                        file = fs.readFileSync(filePath);
                        const fileContentType = `image/${path.extname(filePath).replace(".", "")}`
                        res.setHeader( `Content-type`, fileContentType )
                        res.send(file)
                    } else throw new ClientError(404, "File not found")
                }
            }catch(error){
                console.log(error)
                if(error.status) return res.status(error.status).json({message: error.message})
                else res.status(500).json({message: "Interval Server Error", statusCode: 500})
            }
        }
    }
}

module.exports = {dataController};
