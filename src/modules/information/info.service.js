const infoRepository = require("./info.repository");

class InfoService {
    /**
     * Get all services
     */
    async getAllServices() {
        try {
            const services = await infoRepository.getAllServices();
            return services;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Get all banners
     */
    async getAllBanners() {
        try {
            const banners = await infoRepository.getAllBanners();
            return banners;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Validate service exists for transaction
     */
    async validateServiceForTransaction(serviceCode) {
        try {
            const service = await infoRepository.getServiceByCode(serviceCode);
            if (!service) {
                const error = new Error("Service atau Layanan tidak ditemukan");
                error.status = 400;
                throw error;
            }
            return service;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new InfoService();
