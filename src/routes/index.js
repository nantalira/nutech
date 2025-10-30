const express = require("express");
const router = express.Router();

// Import module routes
const membershipRoutes = require("../modules/membership/user.routes");
const infoRoutes = require("../modules/information/info.routes");
const transactionRoutes = require("../modules/transaction/trx.routes");

// API Documentation endpoint
router.get("/", (_, res) => {
    res.json({
        status: 0,
        message: "SIMS PPOB API - Nutech Integrasi",
        data: {
            version: "1.0.0",
            description: "Sistem Informasi Manajemen PPOB (Postpaid & Prepaid Online Billing)",
            endpoints: {
                authentication: {
                    register: "POST /registration",
                    login: "POST /login",
                },
                profile: {
                    getProfile: "GET /profile",
                    updateProfile: "PUT /profile/update",
                    updateProfileImage: "PUT /profile/image",
                },
                balance: {
                    getBalance: "GET /balance",
                    topUp: "POST /topup",
                },
                information: {
                    getServices: "GET /services",
                    getBanners: "GET /banner",
                },
                transaction: {
                    processTransaction: "POST /transaction",
                    getHistory: "GET /transaction/history",
                },
            },
            documentation: {
                swagger: "/api-docs",
            },
        },
    });
});

// Health check endpoint
router.get("/health", (_, res) => {
    res.status(200).json({
        status: 0,
        message: "Server is running",
        data: {
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            environment: process.env.NODE_ENV || "development 1",
        },
    });
});

router.use("/", membershipRoutes);
router.use("/", infoRoutes);
router.use("/", transactionRoutes);

module.exports = router;
