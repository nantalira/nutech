require("dotenv").config();

const config = {
    port: process.env.PORT || 3000,
    environment: process.env.NODE_ENV || "development",
    database: {
        host: process.env.DB_HOST || "localhost",
        user: process.env.DB_USER || "root",
        password: process.env.DB_PASSWORD || "",
        database: process.env.DB_NAME || "nutech_db",
    },
    jwtSecret: process.env.JWT_SECRET || "your-super-secret-key",
    uploadPath: process.env.UPLOAD_PATH || "public/images/profiles",
    baseUrl: process.env.BASE_URL || "http://localhost:3000",
};

module.exports = config;
