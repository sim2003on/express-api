import { ApiError } from '../exeptions/apiError.js';
import * as tokenService from '../services/tokenService.js';

export default (req, res, next) => {
    const token = (req.headers.authorization || '').replace('Bearer ', '');

    if (token) {
        try {
            const decodedToken = tokenService.validateAccessToken(token);
            req.userId = decodedToken.id;
        } catch (error) {
            throw ApiError.UnauthorizedExeption();
        }
    }

    next();
};
