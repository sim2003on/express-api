import { ApiError } from '../exeptions/apiError.js';
import tokenService from '../services/tokenService.js';

export default (req, res, next) => {
    const token = (req.headers.authorization || '').replace('Bearer ', '');
    if (token) {
        try {
            const decodedToken = tokenService.validateAccessToken(token);
            req.adminId = decodedToken.id;
        } catch (error) {
            throw ApiError.UnauthorizedExeption();
        }
    } else {
        throw ApiError.UnauthorizedExeption();
    }
    next();
};
