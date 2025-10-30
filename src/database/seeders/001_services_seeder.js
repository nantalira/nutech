module.exports = {
    async run(connection) {
        console.log("🌱 Seeding services...");

        const services = [
            { service_code: "PAJAK", service_name: "Pajak PBB", service_icon: "https://nutech-integrasi.app/dummy.jpg", service_tariff: 40000 },
            { service_code: "PLN", service_name: "Listrik", service_icon: "https://nutech-integrasi.app/dummy.jpg", service_tariff: 10000 },
            { service_code: "PDAM", service_name: "PDAM Berlangganan", service_icon: "https://nutech-integrasi.app/dummy.jpg", service_tariff: 40000 },
            { service_code: "PULSA", service_name: "Pulsa", service_icon: "https://nutech-integrasi.app/dummy.jpg", service_tariff: 40000 },
            { service_code: "PGN", service_name: "PGN Berlangganan", service_icon: "https://nutech-integrasi.app/dummy.jpg", service_tariff: 50000 },
            { service_code: "MUSIK", service_name: "Musik Berlangganan", service_icon: "https://nutech-integrasi.app/dummy.jpg", service_tariff: 50000 },
            { service_code: "TV", service_name: "TV Berlangganan", service_icon: "https://nutech-integrasi.app/dummy.jpg", service_tariff: 50000 },
            { service_code: "PAKET_DATA", service_name: "Paket data", service_icon: "https://nutech-integrasi.app/dummy.jpg", service_tariff: 50000 },
            { service_code: "VOUCHER_GAME", service_name: "Voucher Game", service_icon: "https://nutech-integrasi.app/dummy.jpg", service_tariff: 100000 },
            { service_code: "VOUCHER_MAKANAN", service_name: "Voucher Makanan", service_icon: "https://nutech-integrasi.app/dummy.jpg", service_tariff: 100000 },
            { service_code: "QURBAN", service_name: "Qurban", service_icon: "https://nutech-integrasi.app/dummy.jpg", service_tariff: 200000 },
            { service_code: "ZAKAT", service_name: "Zakat", service_icon: "https://nutech-integrasi.app/dummy.jpg", service_tariff: 300000 },
        ];

        // Check if services already exist
        const [existingServices] = await connection.execute("SELECT COUNT(*) as count FROM services");

        if (existingServices[0].count > 0) {
            console.log("⚠️  Services data already exists, skipping...");
            return;
        }

        // Insert services
        for (const service of services) {
            const sql = "INSERT INTO services (service_code, service_name, service_icon, service_tariff) VALUES (?, ?, ?, ?)";
            await connection.execute(sql, [service.service_code, service.service_name, service.service_icon, service.service_tariff]);
        }

        console.log(`✅ ${services.length} services seeded successfully`);
    },
};
