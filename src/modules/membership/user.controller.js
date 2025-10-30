const userService = require("./user.service");
const Joi = require("joi");

// Validation schemas
const registerSchema = Joi.object({
    email: Joi.string().email().required().messages({
        "string.email": "Format email tidak valid",
        "any.required": "Email wajib diisi",
    }),
    first_name: Joi.string().min(1).max(50).required().messages({
        "string.min": "Nama depan tidak boleh kosong",
        "string.max": "Nama depan maksimal 50 karakter",
        "any.required": "Nama depan wajib diisi",
    }),
    last_name: Joi.string().min(1).max(50).required().messages({
        "string.min": "Nama belakang tidak boleh kosong",
        "string.max": "Nama belakang maksimal 50 karakter",
        "any.required": "Nama belakang wajib diisi",
    }),
    password: Joi.string().min(8).required().messages({
        "string.min": "Password minimal 8 karakter",
        "any.required": "Password wajib diisi",
    }),
});

const loginSchema = Joi.object({
    email: Joi.string().email().required().messages({
        "string.email": "Format email tidak valid",
        "any.required": "Email wajib diisi",
    }),
    password: Joi.string().required().messages({
        "any.required": "Password wajib diisi",
    }),
});

const updateProfileSchema = Joi.object({
    first_name: Joi.string().min(1).max(50).required().messages({
        "string.min": "Nama depan tidak boleh kosong",
        "string.max": "Nama depan maksimal 50 karakter",
        "any.required": "Nama depan wajib diisi",
    }),
    last_name: Joi.string().min(1).max(50).required().messages({
        "string.min": "Nama belakang tidak boleh kosong",
        "string.max": "Nama belakang maksimal 50 karakter",
        "any.required": "Nama belakang wajib diisi",
    }),
});

class UserController {
    /**
     * Register new user
     */
    async register(req, res, next) {
        try {
            // Validate request body
            const { error, value } = registerSchema.validate(req.body);
            if (error) {
                return res.status(400).json({
                    status: 102,
                    message: error.details[0].message,
                    data: null,
                });
            }

            await userService.register(value);

            res.status(200).json({
                status: 0,
                message: "Registrasi berhasil silahkan login",
                data: null,
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
     * Login user
     */
    async login(req, res, next) {
        try {
            const { error, value } = loginSchema.validate(req.body);
            if (error) {
                return res.status(400).json({
                    status: 102,
                    message: error.details[0].message,
                    data: null,
                });
            }

            const { email, password } = value;
            const result = await userService.login(email, password);

            res.status(200).json({
                status: 0,
                message: "Login Sukses",
                data: {
                    token: result.token,
                },
            });
        } catch (error) {
            if (error.status === 401) {
                return res.status(401).json({
                    status: 103,
                    message: error.message,
                    data: null,
                });
            }
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
     * Get user profile
     */
    async getProfile(req, res, next) {
        try {
            const userId = req.user.id;
            const profile = await userService.getProfile(userId);

            res.status(200).json({
                status: 0,
                message: "Sukses",
                data: profile,
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
     * Update user profile
     */
    async updateProfile(req, res, next) {
        try {
            // Validate request body
            const { error, value } = updateProfileSchema.validate(req.body);
            if (error) {
                return res.status(400).json({
                    status: 102,
                    message: error.details[0].message,
                    data: null,
                });
            }

            const userId = req.user.id;
            const updatedProfile = await userService.updateProfile(userId, value);

            res.status(200).json({
                status: 0,
                message: "Update Pofile berhasil",
                data: updatedProfile,
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
     * Update profile image
     */
    async updateProfileImage(req, res, next) {
        try {
            if (!req.file) {
                return res.status(400).json({
                    status: 102,
                    message: "File image wajib diupload",
                    data: null,
                });
            }

            const userId = req.user.id;
            const updatedProfile = await userService.updateProfileImage(userId, req.file);

            res.status(200).json({
                status: 0,
                message: "Update Profile Image berhasil",
                data: updatedProfile,
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

module.exports = new UserController();
