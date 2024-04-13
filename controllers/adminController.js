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
                message: 'Регистрация прошла успешно',
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
            console.error('Ошибка при получении профиля:', error.message);
            next(error);
        }
    }

    async resetPassword(req, res, next) {
        try {
            const adminData = await adminService.resetPassword(req);
            return res.status(200).json(adminData);
        } catch (error) {
            console.error('Ошибка при сбросе пароля:', error.message);
            next(error);
        }
    }

    async refreshToken(req, res, next) {
        try {
            const { refreshToken } = req.cookies;
            const adminData = await adminService.refresh(refreshToken);
            res.cookie('refreshToken', adminData.refreshToken, {
                maxAge: 7 * 24 * 60 * 60 * 1000,
                httpOnly: true,
            });
        } catch (error) {
            next(error);
        }
    }
}

export default new AdminController();
