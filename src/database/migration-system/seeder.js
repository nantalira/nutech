const fs = require("fs").promises;
const path = require("path");
const pool = require("../../config/database");

class Seeder {
    constructor() {
        this.seedersPath = path.join(__dirname, "../seeders");
    }

    async run() {
        console.log("🌱 Running all seeders...");
        const files = await this.getSeederFiles();

        for (const file of files) {
            console.log(`   Running seeder: ${file}`);
            const seeder = require(path.join(this.seedersPath, file));
            const connection = await pool.getConnection();

            try {
                await connection.beginTransaction();
                await seeder.run(connection);
                await connection.commit();
                console.log(`   ✅ ${file} completed successfully`);
            } catch (error) {
                await connection.rollback();
                console.error(`   ❌ ${file} failed:`, error.message);
                throw error;
            } finally {
                connection.release();
            }
        }

        console.log("✅ All seeders completed successfully");
    }

    async runSpecific(seederName) {
        console.log(`🌱 Running specific seeder: ${seederName}...`);
        const files = await this.getSeederFiles();
        const targetFile = files.find((file) => file.includes(seederName));

        if (!targetFile) {
            throw new Error(`Seeder '${seederName}' not found`);
        }

        console.log(`   Running seeder: ${targetFile}`);
        const seeder = require(path.join(this.seedersPath, targetFile));
        const connection = await pool.getConnection();

        try {
            await connection.beginTransaction();
            await seeder.run(connection);
            await connection.commit();
            console.log(`   ✅ ${targetFile} completed successfully`);
        } catch (error) {
            await connection.rollback();
            console.error(`   ❌ ${targetFile} failed:`, error.message);
            throw error;
        } finally {
            connection.release();
        }

        console.log(`✅ Seeder '${seederName}' completed successfully`);
    }

    async getSeederFiles() {
        try {
            const files = await fs.readdir(this.seedersPath);
            return files.filter((file) => file.endsWith(".js")).sort(); // Execute in alphabetical order
        } catch (error) {
            if (error.code === "ENOENT") {
                console.log("📁 No seeders directory found. Creating...");
                await fs.mkdir(this.seedersPath, { recursive: true });
                return [];
            }
            throw error;
        }
    }
}

// CLI Handler
const action = process.argv[2];
const seederName = process.argv[4]; // For --seederName format
const seeder = new Seeder();

(async () => {
    try {
        switch (action) {
            case "run":
                await seeder.run();
                break;
            case "run-specific":
                if (!seederName) {
                    console.log("Usage: node seeder.js run-specific -- <seeder-name>");
                    console.log("Example: node seeder.js run-specific -- services");
                    process.exit(1);
                }
                await seeder.runSpecific(seederName);
                break;
            default:
                console.log("Usage: node seeder.js [run|run-specific]");
                console.log("  run          - Run all seeders");
                console.log("  run-specific - Run specific seeder by name");
        }
        process.exit(0);
    } catch (error) {
        console.error("❌ Seeding failed:", error.message);
        process.exit(1);
    }
})();
