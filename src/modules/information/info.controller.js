const infoService = require("./info.service");

class InfoController {
    /**
     * Get all services
     */
    async getServices(_, res, next) {
        try {
            const services = await infoService.getAllServices();

            res.status(200).json({
                status: 0,
                message: "Sukses",
                data: services,
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
     * Get all banners
     */
    async getBanners(_, res, next) {
        try {
            const banners = await infoService.getAllBanners();

            res.status(200).json({
                status: 0,
                message: "Sukses",
                data: banners,
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

module.exports = new InfoController();
