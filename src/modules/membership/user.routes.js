const express = require("express");
const multer = require("multer");
const router = express.Router();

const userController = require("./user.controller");
const { authenticateToken, rateLimitByUser } = require("../../middleware/auth.middleware");

// Configure multer for file upload
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 2 * 1024 * 1024, // 2MB limit
    },
    fileFilter: (_, file, cb) => {
        const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            const error = new Error("Format Image tidak sesuai");
            error.status = 400;
            error.code = "INVALID_FILE_TYPE";
            cb(error, false);
        }
    },
});

router.post("/registration", userController.register);
router.post("/login", userController.login);

router.get("/profile", authenticateToken, rateLimitByUser(100, 15 * 60 * 1000), userController.getProfile);
router.put("/profile/update", authenticateToken, rateLimitByUser(100, 15 * 60 * 1000), userController.updateProfile);
router.put(
    "/profile/image",
    authenticateToken,
    rateLimitByUser(100, 15 * 60 * 1000),
    (req, res, next) => {
        upload.single("file")(req, res, (err) => {
            if (err) {
                // Handle multer errors properly
                if (err.code === "LIMIT_FILE_SIZE") {
                    err.status = 400;
                    err.code = "FILE_TOO_LARGE";
                    err.message = "Ukuran file terlalu besar";
                } else if (err.code === "INVALID_FILE_TYPE") {
                    err.status = 400;
                    err.message = "Format Image tidak sesuai";
                }
                return next(err);
            }
            next();
        });
    },
    userController.updateProfileImage
);

module.exports = router;
