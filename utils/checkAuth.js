import jwt from 'jsonwebtoken';
import { ApiError } from '../exeptions/apiError.js';

export default (req, res, next) => {
    const token = (req.headers.authorization || '').replace('Bearer ', '');

    if (token) {
        try {
            const decodedToken = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
            req.userId = decodedToken.id;
        } catch (error) {
            throw ApiError.UnauthorizedExeption();
        }
    }

    next();
};
