require("dotenv").config();

const DB_NAME = "dashboard";
const URI = process.env.MONGODB_URI || "mongodb://localhost:27017/dashboard";

module.exports.dbName = DB_NAME;
module.exports.db = URI;
