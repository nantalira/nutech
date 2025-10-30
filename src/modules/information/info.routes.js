const express = require("express");
const router = express.Router();

const infoController = require("./info.controller");
const { authenticateToken, rateLimitByUser } = require("../../middleware/auth.middleware");

router.get("/banner", infoController.getBanners);
router.get("/services", authenticateToken, rateLimitByUser(200, 15 * 60 * 1000), infoController.getServices);

module.exports = router;
