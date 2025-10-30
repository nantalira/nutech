const db = require("../../config/database");

class UserRepository {
    /**
     * Find user by email
     */
    async findByEmail(email) {
        try {
            const [rows] = await db.execute("SELECT * FROM users WHERE email = ?", [email]);
            return rows[0] || null;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Find user profile by ID
     */
    async findProfileById(id) {
        try {
            const [rows] = await db.execute("SELECT id, email, first_name, last_name, profile_image FROM users WHERE id = ?", [id]);
            return rows[0] || null;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Check if user exists by ID (minimal query for validation)
     */
    async userExists(id) {
        try {
            const [rows] = await db.execute("SELECT 1 FROM users WHERE id = ? LIMIT 1", [id]);
            return rows.length > 0;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Find user balance by ID (for balance operations)
     */
    async findBalanceById(id) {
        try {
            const [rows] = await db.execute("SELECT id, balance FROM users WHERE id = ?", [id]);
            return rows[0] || null;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Create new user
     */
    async create(userData) {
        try {
            const { id, email, first_name, last_name, password } = userData;

            await db.execute(
                `INSERT INTO users (id, email, first_name, last_name, password, balance, created_at, updated_at) 
         VALUES (?, ?, ?, ?, ?, 0, NOW(), NOW())`,
                [id, email, first_name, last_name, password]
            );
        } catch (error) {
            throw error;
        }
    }

    /**
     * Update user profile
     */
    async updateProfile(id, profileData) {
        try {
            const { first_name, last_name } = profileData;

            await db.execute("UPDATE users SET first_name = ?, last_name = ?, updated_at = NOW() WHERE id = ?", [first_name, last_name, id]);

            return await this.findProfileById(id);
        } catch (error) {
            throw error;
        }
    }

    /**
     * Update user profile image
     */
    async updateProfileImage(id, profileImageUrl) {
        try {
            await db.execute("UPDATE users SET profile_image = ?, updated_at = NOW() WHERE id = ?", [profileImageUrl, id]);

            return await this.findProfileById(id);
        } catch (error) {
            throw error;
        }
    }

    /**
     * Add balance (top up)
     */
    async addBalance(id, amount, connection = null) {
        try {
            const dbConnection = connection || db;

            await dbConnection.execute("UPDATE users SET balance = balance + ?, updated_at = NOW() WHERE id = ?", [amount, id]);

            const [rows] = await dbConnection.execute("SELECT balance FROM users WHERE id = ?", [id]);

            return rows[0]?.balance || 0;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Subtract balance (payment)
     */
    async subtractBalance(id, amount, connection = null) {
        try {
            const dbConnection = connection || db;

            // Check if balance is sufficient
            const [balanceCheck] = await dbConnection.execute("SELECT balance FROM users WHERE id = ?", [id]);

            const currentBalance = balanceCheck[0]?.balance || 0;
            if (currentBalance < amount) {
                throw new Error("Saldo tidak mencukupi");
            }

            await dbConnection.execute("UPDATE users SET balance = balance - ?, updated_at = NOW() WHERE id = ?", [amount, id]);

            const [rows] = await dbConnection.execute("SELECT balance FROM users WHERE id = ?", [id]);

            return rows[0]?.balance || 0;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new UserRepository();
