module.exports = {
    up: async (connection) => {
        const sql = `
      CREATE TABLE services (
        id int PRIMARY KEY AUTO_INCREMENT,
        service_code varchar(50) UNIQUE NOT NULL COMMENT 'Kode unik untuk API, e.g., "PULSA"',
        service_name varchar(100) NOT NULL COMMENT 'Nama layanan, e.g., "Pulsa"',
        service_icon varchar(255) NOT NULL COMMENT 'URL ke icon layanan',
        service_tariff int NOT NULL DEFAULT 0 COMMENT 'Harga atau tarif layanan'
      );
    `;
        await connection.query(sql);
        console.log("✅ Services table created successfully");
    },

    down: async (connection) => {
        await connection.query("DROP TABLE IF EXISTS services");
        console.log("🗑️ Services table dropped successfully");
    },
};
