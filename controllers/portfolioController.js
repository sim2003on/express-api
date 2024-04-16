import { logger } from '../logger/index.js';
import portfolioService from '../services/portfolioService.js';

class PortfolioController {
    async createPortfolio(req, res, next) {
        try {
            const portfolioData = await portfolioService.create(req);
            return res.status(201).json({ message: 'Портфолио успешно создан', portfolioData });
        } catch (error) {
            logger.error({ err: error.message }, 'Ошибка при создании портфолио:');
            next(error);
        }
    }

    async getAllPortfolios(req, res, next) {
        try {
            const query = req.query?.individual;
            const portfolioData = await portfolioService.getAll(query);
            return res.status(200).json(portfolioData);
        } catch (error) {
            logger.error({ err: error.message }, 'Ошибка при получении портфолио:');
            next(error);
        }
    }

    async getOnePortfolio(req, res, next) {
        try {
            const portfolio = await portfolioService.getOne(req.params.id);
            return res.status(200).json(portfolio);
        } catch (error) {
            logger.error({ err: error.message }, 'Ошибка при получении портфолио:');
            next(error);
        }
    }

    async updatePortfolio(req, res, next) {
        try {
            const portfolioData = await portfolioService.update(req.params.id, req.body?.data, req);
            return res.status(200).json({ message: 'Портфолио успешно обновлено', portfolioData });
        } catch (error) {
            logger.error({ err: error.message }, 'Ошибка при обновлении портфолио:');
            next(error);
        }
    }

    async removePortfolio(req, res, next) {
        try {
            await portfolioService.remove(req.params.id);
            return res.status(200).json({ message: 'Портфолио успешно удалено' });
        } catch (error) {
            logger.error({ err: error.message }, 'Ошибка при удалении портфолио:');
            next(error);
        }
    }
}

export default new PortfolioController();
