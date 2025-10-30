const db = require("../../config/database");

class TransactionRepository {
    /**
     * Create new transaction
     */
    async create(transactionData, connection = null) {
        try {
            const dbConnection = connection || db;
            const { id, user_id, invoice_number, transaction_type, description, total_amount } = transactionData;

            await dbConnection.execute(
                `INSERT INTO transactions (id, user_id, invoice_number, transaction_type, description, total_amount, created_at) 
         VALUES (?, ?, ?, ?, ?, ?, NOW())`,
                [id, user_id, invoice_number, transaction_type, description, total_amount]
            );

            return await this.findById(id, dbConnection);
        } catch (error) {
            throw error;
        }
    }

    /**
     * Find transaction by ID
     */
    async findById(id, connection = null) {
        try {
            const dbConnection = connection || db;
            const [rows] = await dbConnection.execute(`SELECT * FROM transactions WHERE id = ?`, [id]);
            return rows[0] || null;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Get transaction history for user
     */
    async getTransactionHistory(userId, limit = 5, offset = 0) {
        try {
            const limitInt = parseInt(limit) || 5;
            const offsetInt = parseInt(offset) || 0;

            const sql = `SELECT invoice_number, transaction_type, description, total_amount, created_at
         FROM transactions 
         WHERE user_id = ? 
         ORDER BY created_at DESC 
         LIMIT ${limitInt} OFFSET ${offsetInt}`;

            const [rows] = await db.execute(sql, [userId]);
            return rows;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Get total transaction count for user
     */
    async getTransactionCount(userId) {
        try {
            const [rows] = await db.execute("SELECT COUNT(*) as count FROM transactions WHERE user_id = ?", [userId]);
            return rows[0].count;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Check if invoice number exists
     */
    async invoiceNumberExists(invoiceNumber) {
        try {
            const [rows] = await db.execute("SELECT COUNT(*) as count FROM transactions WHERE invoice_number = ?", [invoiceNumber]);
            return rows[0].count > 0;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new TransactionRepository();
