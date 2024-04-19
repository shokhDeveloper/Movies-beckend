const { sign, verify} = require("jsonwebtoken")
const {tokenConfig} = require("../config")
const launchToken = {
    sign: (payload) => sign(payload, process.env.BECKEND_KEY, {expiresIn: tokenConfig.time }),
    verify: (token) => verify(token, process.env.BECKEND_KEY)
}
module.exports = {launchToken}