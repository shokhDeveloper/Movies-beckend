const Joi = require("joi");
let username = Joi.string().alphanum().min(3).max(14).error(() => new Error("Username its invalid")).required();
let email = Joi.string().email().error(() => new Error("Email its invalid")).required();
let password =  Joi.string().min(5).max(14).pattern(new RegExp(/(?=.*[A-Za-z]+)(?=.*[0-9]+)(?=.*[@$!%*#?&]+)/)).error(() => new Error("Password its invalid !")).required();

const userValidator = Joi.object({
    username,
    email,
    password,
    signUserDate: Joi.string().max(10).pattern(new RegExp(/^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$/)).error(() => new Error(`Sign user Date its invalid ! Example 2024-05-06`)).required(),
})

const userLoginValidator = Joi.object({
    email,
    password
});
const adminValidator = Joi.object({
    username,
    password
})

const createValidator = (updateDataKeys) => {
    let updateUserValidator = Joi.object();

    if (updateDataKeys.includes("password")) {
        updateUserValidator = updateUserValidator.concat(Joi.object({
            password: password
        }));
    }

    if (updateDataKeys.includes("email")) {
        updateUserValidator = updateUserValidator.concat(Joi.object({
            email: email
        }));
    }

    if (updateDataKeys.includes("username")) {
        updateUserValidator = updateUserValidator.concat(Joi.object({
            username: username
        }));
    }

    return updateUserValidator;
}

module.exports = {userValidator, userLoginValidator, createValidator, adminValidator};