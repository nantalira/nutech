module.exports = {
    up: async (connection) => {
        const sql = `
      CREATE TABLE transactions (
        id BIGINT PRIMARY KEY AUTO_INCREMENT,
        invoice_number varchar(100) UNIQUE NOT NULL COMMENT 'Nomor invoice unik',
        user_id CHAR(36) NOT NULL COMMENT 'Foreign key ke tabel users', 
        transaction_type ENUM ('TOPUP', 'PAYMENT') NOT NULL COMMENT 'Jenis transaksi: TOPUP atau PAYMENT',
        description varchar(255) NOT NULL COMMENT 'Nama layanan dari table service',
        total_amount bigint NOT NULL COMMENT 'Jumlah uang yang terlibat',
        created_at timestamp DEFAULT CURRENT_TIMESTAMP COMMENT 'Waktu transaksi dibuat (sesuai "created_on" di API)',
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE
      );
    `;
        await connection.query(sql);
        console.log("✅ Transactions table created successfully");
    },

    down: async (connection) => {
        await connection.query("DROP TABLE IF EXISTS transactions");
        console.log("🗑️ Transactions table dropped successfully");
    },
};
