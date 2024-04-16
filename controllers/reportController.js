import { logger } from '../logger/index.js';
import reportService from '../services/reportService.js';

class ReportController {
    async createReport(req, res, next) {
        try {
            const report = await reportService.create(req);
            return res.status(201).json({ message: 'Отчет успешно создан', ...report });
        } catch (error) {
            logger.error({ error: error }, 'Ошибка при создании отчета:');
            next(error);
        }
    }

    async getOneReport(req, res, next) {
        try {
            const report = await reportService.getOne(req.params.id);
            return res.status(200).json(report);
        } catch (error) {
            logger.error({ error: error }, 'Ошибка при получении отчета:');
            next(error);
        }
    }

    async getAllReports(req, res, next) {
        try {
            const reports = await reportService.getAll();
            return res.status(200).json(reports);
        } catch (error) {
            logger.error({ error: error }, 'Ошибка при получении отчетов:');
            next(error);
        }
    }

    async removeReport(req, res, next) {
        try {
            await reportService.remove(req.params.id);
            return res.status(200).json({ message: 'Отчет успешно удален' });
        } catch (error) {
            logger.error({ error: error }, 'Ошибка при удалении отчета:');
            next(error);
        }
    }

    async removeAllReports(req, res, next) {
        try {
            const result = await reportService.removeAll();
            return res
                .status(200)
                .json({ message: `Отчеты в количестве ${result.deletedCount} успешно удалены` });
        } catch (error) {
            logger.error({ error: error }, 'Ошибка при удалении отчетов:');
            next(error);
        }
    }
}

export default new ReportController();
