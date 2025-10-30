const jwt = require("jsonwebtoken");
const config = require("../config");

/**
 * Generate a JWT token with email payload
 * @param {Object} payload - The payload to include in token (must contain email)
 * @returns {string} - The generated JWT token
 */
const generateToken = (payload) => {
    return jwt.sign(payload, config.jwtSecret, { expiresIn: "12h" });
};

/**
 * Verify and decode a JWT token
 * @param {string} token - The JWT token to verify
 * @returns {Object} - The decoded payload
 * @throws {Error} - If token is invalid or expired
 */
const verifyToken = (token) => {
    return jwt.verify(token, config.jwtSecret);
};

module.exports = {
    generateToken,
    verifyToken,
};
