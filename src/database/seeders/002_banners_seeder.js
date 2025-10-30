module.exports = {
    async run(connection) {
        console.log("🌱 Seeding banners...");

        const banners = [
            { banner_name: "Banner 1", banner_image: "https://nutech-integrasi.app/dummy.jpg", description: "Lerem Ipsum Dolor sit amet" },
            { banner_name: "Banner 2", banner_image: "https://nutech-integrasi.app/dummy.jpg", description: "Lerem Ipsum Dolor sit amet" },
            { banner_name: "Banner 3", banner_image: "https://nutech-integrasi.app/dummy.jpg", description: "Lerem Ipsum Dolor sit amet" },
            { banner_name: "Banner 4", banner_image: "https://nutech-integrasi.app/dummy.jpg", description: "Lerem Ipsum Dolor sit amet" },
            { banner_name: "Banner 5", banner_image: "https://nutech-integrasi.app/dummy.jpg", description: "Lerem Ipsum Dolor sit amet" },
            { banner_name: "Banner 6", banner_image: "https://nutech-integrasi.app/dummy.jpg", description: "Lerem Ipsum Dolor sit amet" },
        ];

        // Check if banners already exist
        const [existingBanners] = await connection.execute("SELECT COUNT(*) as count FROM banners");

        if (existingBanners[0].count > 0) {
            console.log("⚠️  Banners data already exists, skipping...");
            return;
        }

        // Insert banners
        for (const banner of banners) {
            const sql = "INSERT INTO banners (banner_name, banner_image, description) VALUES (?, ?, ?)";
            await connection.execute(sql, [banner.banner_name, banner.banner_image, banner.description]);
        }

        console.log(`✅ ${banners.length} banners seeded successfully`);
    },
};
