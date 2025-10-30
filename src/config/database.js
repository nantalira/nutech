const mysql = require("mysql2/promise");
const config = require("./index");

// Connection pool
const pool = mysql.createPool({
    host: config.database.host,
    user: config.database.user,
    password: config.database.password,
    database: config.database.database,
    connectionLimit: 10,
    queueLimit: 0,
    charset: "utf8mb4",
    ssl: false,
});

// Test connection
pool.getConnection()
    .then((connection) => {
        console.log("✅ Database connected successfully");
        connection.release();
    })
    .catch((error) => {
        console.error("❌ Database connection failed:", error.message);
    });

module.exports = pool;
