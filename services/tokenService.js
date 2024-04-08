import jwt from 'jsonwebtoken';
import tokenModel from '../models/tokenModel.js';

class TokenService {
    generateTokens(payload) {
        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
            expiresIn: '1h',
        });
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
            expiresIn: '7d',
        });
        return {
            accessToken,
            refreshToken,
        };
    }

    validateAccessToken(token) {
        try {
            const adminData = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
            return adminData;
        } catch (error) {
            return null;
        }
    }

    validateRefreshToken(token) {
        try {
            const adminData = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
            return adminData;
        } catch (error) {
            return null;
        }
    }

    async saveToken(adminId, refreshToken) {
        const tokenData = await tokenModel.findOne({ admin: adminId });
        if (tokenData) {
            tokenData.refreshToken = refreshToken;
            return tokenData.save();
        }
        const token = await tokenModel.create({ admin: adminId, refreshToken });
        return token;
    }

    async removeToken(refreshToken) {
        const tokenData = await tokenModel.deleteOne({ refreshToken });
        return tokenData;
    }

    async findToken(refreshToken) {
        const tokenData = await tokenModel.findOne({ refreshToken });
        return tokenData;
    }
}

export default new TokenService();
