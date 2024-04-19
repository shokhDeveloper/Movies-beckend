const { ClientError } = require("../utils/error");
const {createValidator} = require("../utils/validator")
const fs = require("fs");
const updateUserValidator = (req, res, next) => {
    try {
        const users = req.getData("users");
        const { userId } = req.params;
        if (!users.some(user => user.userId == userId)) throw new ClientError(404, "User not found");
        const userKeys = ["username", "email", "password"];
        const newUserData = req.body;
        const newUserDataKeys = Object.keys(newUserData);
        let count = 0;
        for (let i = 0; i < newUserDataKeys.length; i++) {
            if (userKeys.some(key => newUserDataKeys[i] == key)) count++;
        }
        if (newUserDataKeys.length === count) {
            const validator = createValidator(newUserDataKeys);
            const validation = validator.validate(newUserData);
            if (validation.error) {
                new ClientError(400, validation.error);
            } else {
                return next();
            }
        } else {
            throw new ClientError(400, "User keys invalid! username, email, and password are required.");
        }
    } catch (error) {
        if (req.file && req.file.path) {
            fs.unlinkSync(req.file.path);
        }
        return res.status(400).json({ message: error.message });
    }
};
module.exports = { updateUserValidator };
