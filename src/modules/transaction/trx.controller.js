const transactionService = require("./trx.service");
const Joi = require("joi");

const transactionSchema = Joi.object({
    service_code: Joi.string().min(1).max(50).required().messages({
        "string.min": "Kode service tidak boleh kosong",
        "string.max": "Kode service maksimal 50 karakter",
        "any.required": "Service code wajib diisi",
    }),
});

const topUpSchema = Joi.object({
    top_up_amount: Joi.number().positive().required().messages({
        "number.positive": "Jumlah top up harus lebih dari 0",
        "any.required": "Jumlah top up wajib diisi",
    }),
});

const historyQuerySchema = Joi.object({
    offset: Joi.number().integer().min(0).default(0).messages({
        "number.min": "Offset tidak boleh negatif",
    }),
    limit: Joi.number().integer().min(1).max(100).default(5).messages({
        "number.min": "Limit minimal 1",
        "number.max": "Limit maksimal 100",
    }),
});

class TransactionController {
    /**
     * Get user balance
     */
    async getBalance(req, res, next) {
        try {
            const userId = req.user.id;
            const balance = await transactionService.getBalance(userId);

            res.status(200).json({
                status: 0,
                message: "Get Balance Berhasil",
                data: balance,
            });
        } catch (error) {
            if (error.status) {
                return res.status(error.status).json({
                    status: 102,
                    message: error.message,
                    data: null,
                });
            }
            next(error);
        }
    }

    /**
     * Process top up
     */
    async topUp(req, res, next) {
        try {
            const { error, value } = topUpSchema.validate(req.body);
            if (error) {
                return res.status(400).json({
                    status: 102,
                    message: error.details[0].message,
                    data: null,
                });
            }

            const userId = req.user.id;
            const { top_up_amount } = value;

            const result = await transactionService.topUp(userId, top_up_amount);

            res.status(200).json({
                status: 0,
                message: "Top Up Balance berhasil",
                data: result,
            });
        } catch (error) {
            if (error.status) {
                return res.status(error.status).json({
                    status: 102,
                    message: error.message,
                    data: null,
                });
            }
            next(error);
        }
    }

    /**
     * Process transaction (payment)
     */
    async processTransaction(req, res, next) {
        try {
            const { error, value } = transactionSchema.validate(req.body);
            if (error) {
                return res.status(400).json({
                    status: 102,
                    message: error.details[0].message,
                    data: null,
                });
            }

            const userId = req.user.id;
            const { service_code } = value;

            const transaction = await transactionService.processTransaction(userId, service_code);

            res.status(200).json({
                status: 0,
                message: "Transaksi berhasil",
                data: transaction,
            });
        } catch (error) {
            if (error.status) {
                return res.status(error.status).json({
                    status: 102,
                    message: error.message,
                    data: null,
                });
            }
            next(error);
        }
    }

    /**
     * Get transaction history
     */
    async getTransactionHistory(req, res, next) {
        try {
            const { error, value } = historyQuerySchema.validate(req.query);
            if (error) {
                return res.status(400).json({
                    status: 102,
                    message: error.details[0].message,
                    data: null,
                });
            }

            const userId = req.user.id;
            const { offset, limit } = value;

            const history = await transactionService.getTransactionHistory(userId, limit, offset);

            res.status(200).json({
                status: 0,
                message: "Get History Berhasil",
                data: history,
            });
        } catch (error) {
            if (error.status) {
                return res.status(error.status).json({
                    status: 102,
                    message: error.message,
                    data: null,
                });
            }
            next(error);
        }
    }
}

module.exports = new TransactionController();
