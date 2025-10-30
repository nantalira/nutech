module.exports = {
    up: async (connection) => {
        const sql = `
      CREATE TABLE banners (
        id int PRIMARY KEY AUTO_INCREMENT,
        banner_name varchar(100) NOT NULL,
        banner_image varchar(255) NOT NULL COMMENT 'URL ke gambar banner',
        description varchar(255)
      );
    `;
        await connection.query(sql);
        console.log("✅ Banners table created successfully");
    },

    down: async (connection) => {
        await connection.query("DROP TABLE IF EXISTS banners");
        console.log("🗑️ Banners table dropped successfully");
    },
};
