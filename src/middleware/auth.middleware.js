const { verifyToken } = require("../utils/jwt.helper");
const db = require("../config/database");

/**
 * Middleware untuk autentikasi JWT token
 */
const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers["authorization"];
        const token = authHeader && authHeader.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                status: 108,
                message: "Token tidak valid atau kadaluwarsa",
                data: null,
            });
        }

        const decoded = verifyToken(token);

        if (!decoded) {
            return res.status(401).json({
                status: 108,
                message: "Token tidak valid atau kadaluwarsa",
                data: null,
            });
        }

        const [users] = await db.execute("SELECT id, email, first_name, last_name, profile_image FROM users WHERE email = ?", [decoded.email]);

        if (users.length === 0) {
            return res.status(401).json({
                status: 108,
                message: "Token tidak valid atau kadaluwarsa",
                data: null,
            });
        }

        req.user = {
            id: users[0].id,
            email: users[0].email,
            first_name: users[0].first_name,
            last_name: users[0].last_name,
            profile_image: users[0].profile_image,
        };

        next();
    } catch (error) {
        console.error("Auth middleware error:", error);

        // Handle JWT specific errors
        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({
                status: 108,
                message: "Token tidak valid atau kadaluwarsa",
                data: null,
            });
        }

        if (error.name === "TokenExpiredError") {
            return res.status(401).json({
                status: 108,
                message: "Token tidak valid atau kadaluwarsa",
                data: null,
            });
        }

        // Generic server error
        return res.status(500).json({
            status: 102,
            message: "Internal server error",
            data: null,
        });
    }
};

/**
 * Middleware untuk rate limiting
 * Implementasi sederhana rate limiting per user
 */
const rateLimitByUser = (maxRequests = 100, windowMs = 15 * 60 * 1000) => {
    const requestCounts = new Map();

    return (req, res, next) => {
        const userId = req.user?.id;
        const ip = req.ip || req.connection.remoteAddress;
        const key = userId ? `user:${userId}` : `ip:${ip}`;

        const now = Date.now();
        const windowStart = now - windowMs;

        for (const [k, v] of requestCounts.entries()) {
            if (v.windowStart < windowStart) {
                requestCounts.delete(k);
            }
        }

        const current = requestCounts.get(key) || { count: 0, windowStart: now };

        if (current.windowStart < windowStart) {
            current.count = 0;
            current.windowStart = now;
        }

        current.count++;
        requestCounts.set(key, current);

        if (current.count > maxRequests) {
            return res.status(429).json({
                status: 102,
                message: "Terlalu banyak permintaan, coba lagi nanti",
                data: null,
            });
        }

        res.set({
            "X-RateLimit-Limit": maxRequests,
            "X-RateLimit-Remaining": Math.max(0, maxRequests - current.count),
            "X-RateLimit-Reset": new Date(current.windowStart + windowMs).toISOString(),
        });

        next();
    };
};

module.exports = {
    authenticateToken,
    rateLimitByUser,
};
