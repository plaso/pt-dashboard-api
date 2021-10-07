const cors = require("cors");

const corsMiddleware = cors({
  origin: process.env.CORS_ORIGIN.split(",") || "http://localhost:3001",
  allowedHeaders: ["Content-Type", "Authorization"],
});

module.exports = corsMiddleware;
