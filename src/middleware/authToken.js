const {launchToken} = require("../utils/jwt")
const {tokenConfig} = require("../config");
const { ClientError } = require("../utils/error");
const authToken = (req, res, next) => {
    try{
        const users = req.getData("users");
        const {token} = req.headers;
        if(token){
            const {admin, userAgent} = launchToken.verify(token, tokenConfig.key)
            if(admin){
                if(req.headers["user-agent"] == userAgent){ 
                    req.defUser = {admin, userAgent};
                    return next();
                }else throw new ClientError(401, "The user-agent is invalid !")
            }else{
                const {userId, userAgent} = launchToken.verify(token, tokenConfig.key);
                req.defUser = {userId, userAgent};
                if(!userId || !userAgent) throw new ClientError(401, "Token its invalid !")
                if(users.some(user => user.userId == userId) && (userAgent == req.headers["user-agent"] || req.headers["user-agent"] == tokenConfig.postman_headeers)) return next();
                else throw new ClientError(401, "The token is time limited !")
            }
        }else{
            throw new ClientError(401, "Token not found");
        }
    }catch(error){
        if(error.status) return res.status(error.status).json({message: error.message, status: error.status})
        else return res.status(401).json({message: "The token is time limited"})
    }   
}

module.exports = {authToken};