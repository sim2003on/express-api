import jwt from 'jsonwebtoken';
import tokenModel from '../models/tokenModel.js';

export const generateTokens = (payload) => {
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
};

export const validateAccessToken = (token) => {
    try {
        const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
        return userData;
    } catch (error) {
        return null;
    }
};

export const validateRefreshToken = (token) => {
    try {
        const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
        return userData;
    } catch (error) {
        return null;
    }
};

export const saveToken = async (userId, refreshToken) => {
    const tokenData = await tokenModel.findOne({ user: userId });
    if (tokenData) {
        tokenData.refreshToken = refreshToken;
        return tokenData.save();
    }
    const token = await tokenModel.create({ user: userId, refreshToken });
    return token;
};

export const removeToken = async (refreshToken) => {
    const tokenData = await tokenModel.deleteOne({ refreshToken });
    return tokenData;
};

export const findToken = async (refreshToken) => {
    const tokenData = await tokenModel.findOne({ refreshToken });
    return tokenData;
};
