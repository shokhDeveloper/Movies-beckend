const fs = require("fs");
const {userValidator, userLoginValidator} = require("../utils/validator")
const {launchToken} = require("../utils/jwt")
const {ClientError} = require("../utils/error")
const authController = {
    REGISTER: (req, res) => {
        try{
            const user = req.body;
            if(!(userValidator.validate(user).error instanceof Error)){
                const {filename} = req.file;
                const users = req.getData("users");
                const toCheckUser = req.toCheckUser("register");
                if(toCheckUser){
                    const newUser = {
                        ...req.body,
                        userId: users.length ? users[users.length-1].userId + 1: 1,
                        avatar: filename 
                    }
                    users.push(newUser);
                    req.writeData("users", users);
                    res.json({message: "The user successfull registred !", user: req.body, statusCode: 201, accessToken: launchToken.sign({userId: req.body.userId, userAgent: req.headers["user-agent"]})})
                }
            }else{
                if(req.file){
                    throw new ClientError(400, userValidator.validate(user).error)
                }else{
                    throw new ClientError(400, "Avatar its required !")
                }
            }
        }catch(error){
            if(req.file) {
                fs.unlinkSync(req.file.path);
            }
            return res.status(400).json({message: error.message})
        }
    },
    LOGIN: (req, res) => {
        try{
            if(!userLoginValidator.validate(req.body).error){
                const toCheckUser = req.toCheckUser("login");
                if(toCheckUser){
                    return res.status(200).json({message: "The user successfull logined", accessToken: launchToken.sign({userId: req.body.userId, userAgent: req.headers["user-agent"]}), user: req.body})
                }else{
                    throw new ClientError(404, "The user not found !")
                }
            }else{
                throw new ClientError(400, userLoginValidator.validate(req.body).error)
            }
        }catch(error){
            return res.status(404).json({message: error.message, statusCode: 404, })
        }
    }
}

module.exports = {authController};