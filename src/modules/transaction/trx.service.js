const transactionRepository = require("./trx.repository");
const userRepository = require("../membership/user.repository");
const infoService = require("../information/info.service");
const { generateInvoiceNumber } = require("../../utils/invoice.helper");
const { v4: uuidv4 } = require("uuid");
const db = require("../../config/database");

class TransactionService {
    /**
     * Get user balance
     */
    async getBalance(userId) {
        try {
            const user = await userRepository.findBalanceById(userId);
            if (!user) {
                const error = new Error("User tidak ditemukan");
                error.status = 404;
                throw error;
            }

            return {
                balance: user.balance || 0,
            };
        } catch (error) {
            throw error;
        }
    }

    /**
     * Top up balance
     */
    async topUp(userId, amount) {
        let connection;
        try {
            if (!amount || amount <= 0) {
                const error = new Error("Jumlah top up harus lebih dari 0");
                error.status = 400;
                throw error;
            }

            connection = await db.getConnection();
            await connection.beginTransaction();

            const userExists = await userRepository.userExists(userId);
            if (!userExists) {
                const error = new Error("User tidak ditemukan");
                error.status = 404;
                throw error;
            }

            const invoiceNumber = generateInvoiceNumber();

            const newBalance = await userRepository.addBalance(userId, amount, connection);

            const transactionData = {
                id: uuidv4(),
                user_id: userId,
                invoice_number: invoiceNumber,
                transaction_type: "TOPUP",
                description: "Top Up Balance",
                total_amount: amount,
            };

            await transactionRepository.create(transactionData, connection);

            await connection.commit();

            return {
                balance: newBalance,
            };
        } catch (error) {
            if (connection) {
                await connection.rollback();
            }
            throw error;
        } finally {
            if (connection) {
                connection.release();
            }
        }
    }

    /**
     * Process transaction (payment for service)
     */
    async processTransaction(userId, serviceCode) {
        let connection;
        try {
            connection = await db.getConnection();
            await connection.beginTransaction();

            const service = await infoService.validateServiceForTransaction(serviceCode);

            const user = await userRepository.findBalanceById(userId);
            if (!user) {
                const error = new Error("User tidak ditemukan");
                error.status = 404;
                throw error;
            }

            if (user.balance < service.service_tariff) {
                const error = new Error("Balance tidak mencukupi");
                error.status = 400;
                throw error;
            }

            let invoiceNumber;
            let attempts = 0;
            const maxAttempts = 5;

            do {
                invoiceNumber = generateInvoiceNumber();
                attempts++;

                if (attempts > maxAttempts) {
                    const error = new Error("Gagal generate invoice number");
                    error.status = 500;
                    throw error;
                }
            } while (await transactionRepository.invoiceNumberExists(invoiceNumber));

            await userRepository.subtractBalance(userId, service.service_tariff, connection);

            const transactionData = {
                id: uuidv4(),
                user_id: userId,
                invoice_number: invoiceNumber,
                transaction_type: "PAYMENT",
                description: service.service_name,
                total_amount: service.service_tariff,
            };

            const transaction = await transactionRepository.create(transactionData, connection);

            await connection.commit();

            return {
                invoice_number: transaction.invoice_number,
                service_code: service.service_code,
                service_name: transaction.description,
                transaction_type: transaction.transaction_type,
                total_amount: transaction.total_amount,
                created_on: transaction.created_at,
            };
        } catch (error) {
            if (connection) {
                await connection.rollback();
            }
            throw error;
        } finally {
            if (connection) {
                connection.release();
            }
        }
    }

    /**
     * Get transaction history
     */
    async getTransactionHistory(userId, limit = 5, offset = 0) {
        try {
            const userExists = await userRepository.userExists(userId);
            if (!userExists) {
                const error = new Error("User tidak ditemukan");
                error.status = 404;
                throw error;
            }

            const sanitizedLimit = Math.min(Math.max(parseInt(limit) || 5, 1), 100); // Min 1, Max 100
            const sanitizedOffset = Math.max(parseInt(offset) || 0, 0); // Min 0

            const transactions = await transactionRepository.getTransactionHistory(userId, sanitizedLimit, sanitizedOffset);

            const formattedTransactions = transactions.map((transaction) => ({
                invoice_number: transaction.invoice_number,
                transaction_type: transaction.transaction_type,
                description: transaction.description,
                total_amount: transaction.total_amount,
                created_on: transaction.created_at,
            }));

            return {
                offset: sanitizedOffset,
                limit: sanitizedLimit,
                records: formattedTransactions,
            };
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new TransactionService();
