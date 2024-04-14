import { logger } from '../logger/index.js';
import adminService from '../services/adminService.js';

class AdminController {
    async register(req, res, next) {
        try {
            const adminData = await adminService.register(req);
            res.cookie('refreshToken', adminData.refreshToken, {
                maxAge: 7 * 24 * 60 * 60 * 1000,
                httpOnly: true,
            });
            return res.status(201).json({
                success: true,
                message:
                    'Регистрация прошла успешно, на вашу почту отправлена ссылка для подтверждения почты',
                ...adminData,
            });
        } catch (error) {
            console.error('Ошибка при регистрации:', error.message);
            next(error);
        }
    }

    async login(req, res, next) {
        try {
            const adminData = await adminService.login(req);
            res.cookie('refreshToken', adminData.refreshToken, {
                maxAge: 7 * 24 * 60 * 60 * 1000,
                httpOnly: true,
            });
            return res.status(200).json(adminData);
        } catch (error) {
            console.error('Ошибка при авторизации:', error.message);
            next(error);
        }
    }

    async logout(req, res, next) {
        try {
            const { refreshToken } = req.cookies;
            await adminService.logout(refreshToken);
            res.clearCookie('refreshToken');
            return res.status(200).json({ message: 'Вы успешно вышли из системы.' });
        } catch (error) {
            console.error(error);
            next(error);
        }
    }

    async getProfile(req, res, next) {
        try {
            const adminData = await adminService.getProfile(req);
            return res.status(200).json(adminData);
        } catch (error) {
            logger.warn({ err: error.message }, 'Ошибка при получении профиля:');
            next(error);
        }
    }

    async activateAccount(req, res, next) {
        try {
            await adminService.activateAccount(req.params.link);
            return res.status(200).json({ message: 'Аккаунт успешно активирован' });
        } catch (error) {
            logger.warn({ err: error.message }, 'Ошибка при активации аккаунта:');
            next(error);
        }
    }

    async forgotPassword(req, res, next) {
        try {
            const email = req.body.email;
            await adminService.forgotPassword(email);
            return res
                .status(200)
                .json({ message: 'Ссылка для сброса пароля отправлена на указанную почту' });
        } catch (error) {
            logger.warn(
                { err: error.message },
                'Ошибка при отправке ссылки сброса пароля на почту:',
            );
            next(error);
        }
    }

    async resetPassword(req, res, next) {
        try {
            const token = req.body.token;
            const password = req.body.password;
            await adminService.resetPassword(token, password);
            return res.status(200).json({ message: 'Пароль успешно изменен' });
        } catch (error) {
            console.error('Ошибка при сбросе пароля:', error.message);
            next(error);
        }
    }

    async refreshToken(req, res, next) {
        try {
            const { refreshToken } = req.cookies;
            const tokens = await adminService.refresh(refreshToken);
            res.cookie('refreshToken', tokens.refreshToken, {
                maxAge: 7 * 24 * 60 * 60 * 1000,
                httpOnly: true,
            });
            res.status(200).json(tokens);
        } catch (error) {
            next(error);
        }
    }
}

export default new AdminController();
