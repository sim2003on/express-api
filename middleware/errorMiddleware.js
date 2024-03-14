import { ApiError } from '../exeptions/apiError.js';

export const errorMiddleware = (err, req, res, next) => {
    if (err instanceof ApiError) {
        return res.status(err.status).json({ message: err.message });
    }
    console.error(err);
    return res.status(500).json({ message: 'Внутренняя ошибка сервера' });
};
