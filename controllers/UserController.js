import * as userService from '../services/userService.js';

export const register = async (req, res, next) => {
    try {
        const userData = await userService.register(req);

        res.cookie('refreshToken', userData.refreshToken, {
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true,
        });
        return res.status(201).json({
            success: true,
            message: 'Регистрация прошла успешно',
            ...userData,
        });
    } catch (error) {
        console.error('Ошибка при регистрации:', error.message);
        next(error);
    }
};

export const login = async (req, res, next) => {
    try {
        const userData = await userService.login(req);
        res.cookie('refreshToken', userData.refreshToken, {
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true,
        });
        return res.status(200).json(userData);
    } catch (error) {
        console.error('Ошибка при авторизации:', error.message);
        next(error);
    }
};

export const logout = async (req, res, next) => {
    try {
        const { refreshToken } = req.cookies;
        await userService.logout(refreshToken);
        res.clearCookie('refreshToken');
        return res.status(200).json({ message: 'Вы успешно вышли из системы.' });
    } catch (error) {
        console.error(error);
        next(error);
    }
};

export const getProfile = async (req, res, next) => {
    try {
        const userData = await userService.getProfile(req);
        return res.status(200).json(userData);
    } catch (error) {
        console.error('Ошибка при получении профиля:', error.message);
        next(error);
    }
};

export const refreshToken = async (req, res, next) => {
    try {
        const { refreshToken } = req.cookies;
        const userData = await userService.refresh(refreshToken);

        res.cookie('refreshToken', userData.refreshToken, {
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true,
        });
    } catch (error) {
        next(error);
    }
};
