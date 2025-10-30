const { hashPassword } = require("../../utils/hash.helper");
const { v4: uuidv4 } = require("uuid");

module.exports = {
    async run(connection) {
        console.log("🌱 Seeding test users...");

        const testUsers = [
            { email: "user@nutech-integrasi.com", first_name: "User", last_name: "Nutech", password: "abcdef1234", balance: 2000000 },
            { email: "admin@nutech-integrasi.com", first_name: "Admin", last_name: "Nutech", password: "admin1234", balance: 5000000 },
            { email: "test@nutech-integrasi.com", first_name: "Test", last_name: "User", password: "test1234", balance: 1000000 },
        ];

        // Check if test users already exist
        const [existingUsers] = await connection.execute("SELECT COUNT(*) as count FROM users WHERE email IN (?, ?, ?)", ["user@nutech-integrasi.com", "admin@nutech-integrasi.com", "test@nutech-integrasi.com"]);

        if (existingUsers[0].count > 0) {
            console.log("⚠️  Test users already exist, skipping...");
            return;
        }

        // Insert test users
        for (const user of testUsers) {
            const hashedPassword = await hashPassword(user.password);
            const userId = uuidv4();
            const sql = "INSERT INTO users (id, email, first_name, last_name, password, balance) VALUES (?, ?, ?, ?, ?, ?)";
            await connection.execute(sql, [userId, user.email, user.first_name, user.last_name, hashedPassword, user.balance]);
        }

        console.log(`✅ ${testUsers.length} test users seeded successfully`);
        console.log("📋 Test user credentials:");
        testUsers.forEach((user) => {
            console.log(`   📧 ${user.email} | 🔑 ${user.password} | 💰 ${user.balance.toLocaleString()}`);
        });
    },
};
