import { ApiError } from '../exeptions/apiError.js';
import { logger } from '../logger/index.js';

export const errorMiddleware = (err, req, res, next) => {
    if (err instanceof ApiError) {
        return res.status(err.status).json({ message: err.message });
    }

    logger.error(err);

    return res.status(500).json({ message: 'Внутренняя ошибка сервера' });
};
