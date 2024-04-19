const PORT = process.env.PORT || 4000;
require("dotenv").config()

const tokenConfig = {
    postman_headeers: "PostmanRuntime/7.37.3",
    time: 60 * 60 * 24,
    key: process.env.BECKEND_KEY
};
const PaginationSettings = {
    page: 1,
    limit: 20
}

module.exports = {PORT, tokenConfig, PaginationSettings}; 