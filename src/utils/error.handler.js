/**
 * Global error handler middleware
 */
const globalErrorHandler = (err, req, res, next) => {
    console.error("Global Error Handler:", err);
    console.error("Error details:", {
        name: err.name,
        message: err.message,
        code: err.code,
        stack: err.stack,
    });

    // Handle Multer file upload errors
    if (err.message === "Format Image tidak sesuai" || err.code === "INVALID_FILE_TYPE") {
        return res.status(400).json({
            status: 106,
            message: "Format Image tidak sesuai",
            data: null,
        });
    }

    if (err.message === "Ukuran file terlalu besar" || err.code === "LIMIT_FILE_SIZE" || err.code === "FILE_TOO_LARGE") {
        return res.status(400).json({
            status: 107,
            message: "Ukuran file terlalu besar",
            data: null,
        });
    }

    // Handle other Multer errors
    if (err.code === "LIMIT_UNEXPECTED_FILE") {
        return res.status(400).json({
            status: 102,
            message: "Parameter tidak sesuai format",
            data: null,
        });
    }

    // Handle general MulterError
    if (err.name === "MulterError") {
        return res.status(400).json({
            status: 102,
            message: "Error upload file",
            data: null,
        });
    }

    // Handle JWT errors
    if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
        return res.status(401).json({
            status: 108,
            message: "Token tidak valid atau kadaluwarsa",
            data: null,
        });
    }

    // Handle database errors
    if (err.code === "ER_DUP_ENTRY") {
        return res.status(400).json({
            status: 102,
            message: "Email sudah terdaftar",
            data: null,
        });
    }

    if (err.code === "ER_NO_REFERENCED_ROW_2") {
        return res.status(400).json({
            status: 102,
            message: "Data referensi tidak ditemukan",
            data: null,
        });
    }

    // Handle validation errors
    if (err.name === "ValidationError") {
        return res.status(400).json({
            status: 102,
            message: "Parameter tidak sesuai format",
            data: null,
        });
    }

    // Handle custom application errors
    if (err.status) {
        const statusMap = {
            400: {
                "Email sudah terdaftar": 102,
                "Parameter tidak sesuai format": 102,
                "Saldo tidak mencukupi": 104,
                "Service atau Layanan tidak ditemukan": 105,
                "Format Image tidak sesuai": 106,
                "Ukuran file terlalu besar": 107,
            },
            401: {
                "Username atau password salah": 103,
                "Token tidak valid atau kadaluwarsa": 108,
            },
            404: {
                "User tidak ditemukan": 102,
                "Data tidak ditemukan": 102,
            },
        };

        const statusCode = statusMap[err.status]?.[err.message] || 102;

        return res.status(err.status).json({
            status: statusCode,
            message: err.message,
            data: null,
        });
    }

    // Default server error
    return res.status(500).json({
        status: 102,
        message: "Internal server error",
        data: null,
    });
};

/**
 * 404 Not Found handler
 */
const notFoundHandler = (req, res) => {
    return res.status(404).json({
        status: 102,
        message: "Endpoint tidak ditemukan",
        data: null,
    });
};

module.exports = {
    globalErrorHandler,
    notFoundHandler,
};
