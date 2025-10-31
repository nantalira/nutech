const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const fs = require("fs");

// Import routes
const indexRouter = require("./routes");

// Import error handlers
const { globalErrorHandler, notFoundHandler } = require("./utils/error.handler");
const config = require("./config");

const app = express();

// Trust proxy (important for rate limiting behind reverse proxy)
app.set("trust proxy", 1);

// View engine setup
app.set("views", path.join(__dirname, "..", "views"));
app.set("view engine", "jade");

// Middleware setup
app.use(logger("dev"));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: false, limit: "10mb" }));
app.use(cookieParser());

// CORS configuration
app.use(
    cors({
        origin: config.environment === "production" ? [config.baseUrl] : ["http://localhost:3000", "http://localhost:3001"],
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    })
);

// Static files
app.use(express.static(path.join(__dirname, "..", "public")));

// API routes
app.use("/api/v1", indexRouter);

// Root redirect to API
app.get("/", (_, res) => {
    res.redirect("/api/v1");
});

// Load API documentation
let apiSpec;
try {
    const apiSpecPath = path.join(__dirname, "..", "public", "docs", "api.json");
    apiSpec = JSON.parse(fs.readFileSync(apiSpecPath, "utf8"));
} catch (error) {
    console.warn("⚠️ Could not load API specification:", error.message);
    apiSpec = {
        openapi: "3.0.0",
        info: {
            title: "SIMS PPOB API",
            version: "1.0.0",
            description: "REST API untuk sistem PPOB menggunakan Express.js",
        },
        paths: {},
    };
}

// Swagger UI routes
app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(apiSpec, {
        explorer: true,
        customCss: ".swagger-ui .topbar { display: none }",
        customSiteTitle: "SIMS PPOB API Documentation",
    })
);

// 404 handler
app.use(notFoundHandler);

// Global error handler
app.use(globalErrorHandler);

module.exports = app;
