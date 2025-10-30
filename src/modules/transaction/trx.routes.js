const express = require("express");
const router = express.Router();

const transactionController = require("./trx.controller");
const { authenticateToken, rateLimitByUser } = require("../../middleware/auth.middleware");

router.get("/balance", authenticateToken, rateLimitByUser(50, 15 * 60 * 1000), transactionController.getBalance);
router.post("/topup", authenticateToken, rateLimitByUser(50, 15 * 60 * 1000), transactionController.topUp);
router.post("/transaction", authenticateToken, rateLimitByUser(50, 15 * 60 * 1000), transactionController.processTransaction);
router.get("/transaction/history", authenticateToken, rateLimitByUser(50, 15 * 60 * 1000), transactionController.getTransactionHistory);

module.exports = router;
