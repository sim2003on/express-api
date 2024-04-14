import argon2 from 'argon2';
import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { AdminDto } from '../dto/adminDto.js';
import { ApiError } from '../exeptions/apiError.js';
import Admin from '../models/adminModel.js';
import mailService from './mailService.js';
import tokenService from './tokenService.js';

class AdminService {
    async register(req) {
        let session;
        try {
            const isExistAdmin = await Admin.findOne({ email: req.body.email });
            if (isExistAdmin) {
                throw ApiError.ConflictExeption('Администратор уже существует');
            }
            session = await mongoose.startSession();
            session.startTransaction();

            const passwordHash = await argon2.hash(req.body.password);
            const activationLink = uuidv4();
            const newAdmin = new Admin({
                login: req.body.login,
                email: req.body.email,
                role: req.body.role,
                region: req.body.region,
                activationLink: activationLink,
                passwordHash,
            });
            await mailService.sendActivationMail(req.body.email, activationLink);
            const admin = await newAdmin.save({ session });
            const adminDto = new AdminDto(admin);
            const tokens = tokenService.generateTokens({ ...adminDto });
            await tokenService.saveToken(adminDto.id, tokens.refreshToken);
            await session.commitTransaction();
            session.endSession();
            return {
                admin: adminDto,
                accessToken: tokens.accessToken,
                refreshToken: tokens.refreshToken,
            };
        } catch (error) {
            await session?.abortTransaction();
            session?.endSession();
            throw error;
        }
    }

    async login(req) {
        try {
            const admin = await Admin.findOne({ email: req.body.email });
            if (!admin) {
                throw ApiError.NotFoundExeption('Неверный логин/почта или пароль.');
            }
            const passwordMatch = await argon2.verify(admin.passwordHash, req.body.password);
            if (!passwordMatch) {
                throw ApiError.BadRequestExeption('Неверный логин/почта или пароль.');
            }
            const adminDto = new AdminDto(admin);
            const tokens = tokenService.generateTokens({ ...adminDto });
            await tokenService.saveToken(adminDto.id, tokens.refreshToken);
            const { accessToken, refreshToken } = tokens;
            return {
                success: true,
                message: 'Авторизация прошла успешно',
                accessToken,
                refreshToken,
            };
        } catch (error) {
            throw error;
        }
    }

    async logout(refreshToken) {
        try {
            const token = await tokenService.removeToken(refreshToken);
            return token;
        } catch (error) {
            throw error;
        }
    }

    async getProfile(req) {
        try {
            const admin = await Admin.findById(req.adminId);
            if (!admin) {
                throw ApiError.NotFoundExeption('Администратор не найден');
            }
            const adminDto = new AdminDto(admin);
            return {
                success: true,
                ...adminDto,
            };
        } catch (error) {
            throw error;
        }
    }

    async checkAuth(req) {
        try {
            const admin = await Admin.findById(req.adminId);
            if (!admin) {
                throw ApiError.NotFoundExeption('Администратор не найден');
            }
            const adminDto = new AdminDto(admin);
            return {
                success: true,
                ...adminDto,
            };
        } catch (error) {
            throw error;
        }
    }

    async activateAccount(activationLink) {
        try {
            const admin = await Admin.findOne({ activationLink });
            if (!admin) {
                throw ApiError.BadRequestExeption('Ссылка активации недействительна');
            }
            admin.isActivated = true;
            admin.activationLink = undefined;
            await admin.save();
        } catch (error) {
            throw error;
        }
    }

    async forgotPassword(email) {
        try {
            const admin = await Admin.findOne({ email });
            if (!admin) {
                throw ApiError.NotFoundExeption('Неверная почта');
            }
            if (admin.isActivated === false) {
                throw ApiError.BadRequestExeption('Ваша почта не была потверждена');
            }
            const resetToken = uuidv4();
            admin.resetPasswordToken = resetToken;
            admin.resetPasswordExpires = Date.now() + 3600000;
            await admin.save();

            await mailService.sendResetPasswordMail(email, resetToken);
        } catch (error) {
            throw error;
        }
    }

    async resetPassword(resetToken, newPassword) {
        try {
            const admin = await Admin.findOne({
                resetPasswordToken: resetToken,
                resetPasswordExpires: { $gt: Date.now() },
            });
            if (!admin) {
                throw ApiError.BadRequestExeption('Неверный токен или время действия истекло');
            }
            const passwordHash = await argon2.hash(newPassword);
            admin.passwordHash = passwordHash;
            admin.resetPasswordToken = undefined;
            admin.resetPasswordExpires = undefined;
            await admin.save();
        } catch (error) {
            throw error;
        }
    }

    async refresh(refreshToken) {
        if (!refreshToken) {
            throw ApiError.UnauthorizedExeption();
        }
        const adminData = tokenService.validateRefreshToken(refreshToken);
        const tokenFromDB = await tokenService.findToken(refreshToken);
        if (!adminData || !tokenFromDB) {
            throw ApiError.UnauthorizedExeption();
        }
        const admin = await Admin.findById(adminData.id);
        const adminDto = new AdminDto(admin);
        const tokens = tokenService.generateTokens({ ...adminDto });
        await tokenService.saveToken(adminDto.id, tokens.refreshToken);
        return { ...tokens };
    }
}

export default new AdminService();
