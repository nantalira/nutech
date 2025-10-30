const fs = require("fs").promises;
const path = require("path");
const pool = require("../../config/database");

class Migrator {
    constructor() {
        this.migrationsPath = path.join(__dirname, "../migrations");
    }

    async migrate() {
        console.log("🚀 Running migrations...");
        const files = await this.getMigrationFiles();

        for (const file of files) {
            console.log(`   Running migration: ${file}`);
            const migration = require(path.join(this.migrationsPath, file));
            const connection = await pool.getConnection();

            try {
                await connection.beginTransaction();
                await migration.up(connection);
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

        console.log("✅ All migrations completed successfully");
    }

    async rollback() {
        console.log("🔄 Rolling back migrations...");
        const files = await this.getMigrationFiles();
        files.reverse(); // Reverse order for rollback

        for (const file of files) {
            console.log(`   Rolling back: ${file}`);
            const migration = require(path.join(this.migrationsPath, file));
            const connection = await pool.getConnection();

            try {
                await connection.beginTransaction();
                await migration.down(connection);
                await connection.commit();
                console.log(`   ✅ ${file} rolled back successfully`);
            } catch (error) {
                await connection.rollback();
                console.error(`   ❌ ${file} rollback failed:`, error.message);
                throw error;
            } finally {
                connection.release();
            }
        }

        console.log("✅ All migrations rolled back successfully");
    }

    async fresh() {
        console.log("🔄 Fresh migration: dropping and recreating all tables...");
        try {
            await this.rollback();
            await this.migrate();
            console.log("✅ Fresh migration completed successfully");
        } catch (error) {
            console.error("❌ Fresh migration failed:", error.message);
            throw error;
        }
    }

    async getMigrationFiles() {
        try {
            const files = await fs.readdir(this.migrationsPath);
            return files.filter((file) => file.endsWith(".js")).sort(); // Execute in alphabetical order
        } catch (error) {
            if (error.code === "ENOENT") {
                console.log("📁 No migrations directory found. Creating...");
                await fs.mkdir(this.migrationsPath, { recursive: true });
                return [];
            }
            throw error;
        }
    }
}

// CLI Handler
const action = process.argv[2];
const migrator = new Migrator();

(async () => {
    try {
        switch (action) {
            case "migrate":
                await migrator.migrate();
                break;
            case "rollback":
                await migrator.rollback();
                break;
            case "fresh":
                await migrator.fresh();
                break;
            default:
                console.log("Usage: node migrator.js [migrate|rollback|fresh]");
                console.log("  migrate   - Run all pending migrations");
                console.log("  rollback  - Rollback all migrations");
                console.log("  fresh     - Drop all tables and re-run migrations");
        }
        process.exit(0);
    } catch (error) {
        console.error("❌ Migration failed:", error.message);
        process.exit(1);
    }
})();
