const {PaginationSettings} = require("../config")

module.exports = (req, _, next) => {
    req.PAGINATION = PaginationSettings;
    return next();
}