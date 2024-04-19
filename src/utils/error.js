// const errorHandler = (error, req, res, next) => {
//     if([400, 401, 404, 415, 413].includes(error.status)){
//         return res.status(error.status).send(error);
//     }else if(error.status == 500){
//         return res.status(500).send("Internal Server Error");
//     }else{
//         return res.status(500).send(error)
//     }
// }

class ServerError extends Error {
    constructor(message ){
        super();
        this.status = 500;
        this.message = "Internal Server Error: " + message
    }
}

class ClientError extends Error {
    constructor(status, message){
        super()
        this.status = status;
        this.message = "ClientError: " + message;
    }
}

module.exports = {ServerError, ClientError};

// 400 (Bad Request), 401 (Unauthorized), 404 (Nort Found), 415 (Unsupported Media Type), 413 (Payload Media miles) 

// 500 (Server Error)