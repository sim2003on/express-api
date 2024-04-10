import portfolioService from '../services/portfolioService.js';

class PortfolioController {
    async createPortfolio(req, res, next) {
        try {
            const portfolioData = await portfolioService.createPortfolio(req);

            return res.status(201).json({ message: 'Портфолио успешно создан', portfolioData });
        } catch (error) {
            next(error);
        }
    }

    async getAllPortfolios(req, res, next) {
        try {
            const portfolioData = await portfolioService.getAllPortfolios();
            return res.status(200).json(portfolioData);
        } catch (error) {
            next(error);
        }
    }

    async getOnePortfolio(req, res, next) {
        try {
            const portfolio = await portfolioService.getOnePortfolio(req.params.id);
            return res.status(200).json(portfolio);
        } catch (error) {
            next(error);
        }
    }

    async updatePortfolio(req, res, next) {
        try {
            const portfolioData = await portfolioService.updatePortfolio(
                req.params.id,
                req.body?.data,
                req,
            );

            return res.status(200).json({ message: 'Портфолио успешно обновлено', portfolioData });
        } catch (error) {
            next(error);
        }
    }

    async removePortfolio(req, res, next) {
        try {
            await portfolioService.removePortfolio(req.params.id);
            return res.status(200).json({ message: 'Портфолио успешно удалено' });
        } catch (error) {
            next(error);
        }
    }
}

export default new PortfolioController();
