CREATE TABLE `users` (
  `id` CHAR(36) PRIMARY KEY,
  `email` varchar(255) UNIQUE NOT NULL COMMENT 'Email untuk login',
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100),
  `password` varchar(255) NOT NULL COMMENT 'Password yang sudah di-hash',
  `profile_image` varchar(255) COMMENT 'URL ke gambar profile',
  `balance` bigint NOT NULL DEFAULT 0,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP, 
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP 
);

CREATE TABLE `services` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `service_code` varchar(50) UNIQUE NOT NULL COMMENT 'Kode unik untuk API, e.g., "PULSA"',
  `service_name` varchar(100) NOT NULL COMMENT 'Nama layanan, e.g., "Pulsa"',
  `service_icon` varchar(255) NOT NULL COMMENT 'URL ke icon layanan',
  `service_tariff` int NOT NULL DEFAULT 0 COMMENT 'Harga atau tarif layanan'
);

CREATE TABLE `banners` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `banner_name` varchar(100) NOT NULL,
  `banner_image` varchar(255) NOT NULL COMMENT 'URL ke gambar banner',
  `description` varchar(255)
);

CREATE TABLE `transactions` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `invoice_number` varchar(100) UNIQUE NOT NULL COMMENT 'Nomor invoice unik',
  `user_id` CHAR(36) NOT NULL COMMENT 'Foreign key ke tabel users', 
  `transaction_type` ENUM ('TOPUP', 'PAYMENT') NOT NULL COMMENT 'Jenis transaksi: TOPUP atau PAYMENT',
  `description` varchar(255) NOT NULL COMMENT 'Nama layanan dari table service',
  `total_amount` bigint NOT NULL COMMENT 'Jumlah uang yang terlibat',
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP COMMENT 'Waktu transaksi dibuat (sesuai "created_on" di API)' 
);

ALTER TABLE `transactions` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;