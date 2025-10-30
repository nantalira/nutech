const db = require("../../config/database");

class InfoRepository {
    /**
     * Get all services
     */
    async getAllServices() {
        try {
            const [rows] = await db.execute("SELECT service_code, service_name, service_icon, service_tariff FROM services ORDER BY service_name ASC");
            return rows;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Get service by code
     */
    async getServiceByCode(serviceCode) {
        try {
            const [rows] = await db.execute("SELECT * FROM services WHERE service_code = ?", [serviceCode]);
            return rows[0] || null;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Get all banners
     */
    async getAllBanners() {
        try {
            const [rows] = await db.execute("SELECT banner_name, banner_image, description FROM banners ORDER BY banner_name ASC");
            return rows;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new InfoRepository();
