module.exports = {
    up: async (connection) => {
        const sql = `
      CREATE TABLE users (
        id CHAR(36) PRIMARY KEY,
        email varchar(255) UNIQUE NOT NULL COMMENT 'Email untuk login',
        first_name varchar(100) NOT NULL,
        last_name varchar(100),
        password varchar(255) NOT NULL COMMENT 'Password yang sudah di-hash',
        profile_image varchar(255) COMMENT 'URL ke gambar profile',
        balance bigint NOT NULL DEFAULT 0,
        created_at timestamp DEFAULT CURRENT_TIMESTAMP, 
        updated_at timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP 
      );
    `;
        await connection.query(sql);
        console.log("✅ Users table created successfully");
    },

    down: async (connection) => {
        await connection.query("DROP TABLE IF EXISTS users");
        console.log("🗑️ Users table dropped successfully");
    },
};
