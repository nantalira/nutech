const userRepository = require("./user.repository");
const { hashPassword, comparePassword } = require("../../utils/hash.helper");
const { generateToken } = require("../../utils/jwt.helper");
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const fs = require("fs").promises;

class UserService {
    /**
     * Register new user
     */
    async register(userData) {
        try {
            const { email, first_name, last_name, password } = userData;

            const existingUser = await userRepository.findByEmail(email);
            if (existingUser) {
                const error = new Error("Email sudah terdaftar");
                error.status = 400;
                throw error;
            }

            const hashedPassword = await hashPassword(password);

            const userId = uuidv4();

            await userRepository.create({
                id: userId,
                email,
                first_name,
                last_name,
                password: hashedPassword,
            });
        } catch (error) {
            throw error;
        }
    }

    /**
     * Login user
     */
    async login(email, password) {
        try {
            const user = await userRepository.findByEmail(email);
            if (!user) {
                const error = new Error("Email atau password salah");
                error.status = 401;
                throw error;
            }

            const isPasswordValid = await comparePassword(password, user.password);
            if (!isPasswordValid) {
                const error = new Error("Email atau password salah");
                error.status = 401;
                throw error;
            }

            const token = generateToken({ userId: user.id, email: user.email });

            return { token };
        } catch (error) {
            throw error;
        }
    }

    /**
     * Get user profile
     */
    async getProfile(userId) {
        try {
            const profile = await userRepository.findProfileById(userId);
            if (!profile) {
                const error = new Error("User tidak ditemukan");
                error.status = 404;
                throw error;
            }

            return profile;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Update user profile
     */
    async updateProfile(userId, profileData) {
        try {
            const { first_name, last_name } = profileData;

            // Check if user exists
            const userExists = await userRepository.userExists(userId);
            if (!userExists) {
                const error = new Error("User tidak ditemukan");
                error.status = 404;
                throw error;
            }

            // Update profile
            const profile = await userRepository.updateProfile(userId, {
                first_name,
                last_name,
            });

            return profile;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Update profile image
     */
    async updateProfileImage(userId, file) {
        try {
            const existingUser = await userRepository.findProfileById(userId);
            if (!existingUser) {
                const error = new Error("User tidak ditemukan");
                error.status = 404;
                throw error;
            }

            const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
            if (!allowedTypes.includes(file.mimetype)) {
                const error = new Error("Format Image hanya boleh JPEG atau PNG");
                error.status = 400;
                throw error;
            }

            const fileExtension = path.extname(file.originalname);
            const fileName = `profile_${userId}_${Date.now()}${fileExtension}`;
            const baseUrl = process.env.BASE_URL || "http://localhost:3000";
            const profileImageUrl = `${baseUrl}/images/${fileName}`;

            const uploadPath = path.join(__dirname, "../../../public/images");
            const filePath = path.join(uploadPath, fileName);

            await fs.mkdir(uploadPath, { recursive: true });

            await fs.writeFile(filePath, file.buffer);

            if (existingUser.profile_image) {
                try {
                    const oldFileName = path.basename(existingUser.profile_image);
                    const oldFilePath = path.join(uploadPath, oldFileName);
                    await fs.unlink(oldFilePath);
                } catch (err) {
                    console.log("Could not delete old profile image:", err.message);
                }
            }

            const profile = await userRepository.updateProfileImage(userId, profileImageUrl);

            return profile;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new UserService();
