import argon2 from 'argon2';
import mongoose from 'mongoose';
import { UserDto } from '../dto/userDto.js';
import { ApiError } from '../exeptions/apiError.js';
import User from '../models/userModel.js';
import * as tokenService from './tokenService.js';

export const register = async (req) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const isExistUser = await User.findOne({
            $or: [{ phone: req.body.phone }, { email: req.body.email }],
        });

        if (isExistUser) {
            if (isExistUser.email === req.body.email && isExistUser.phone === req.body.phone) {
                throw ApiError.BadRequestExeption('Пользователь уже существует');
            }
            if (isExistUser.phone === req.body.phone) {
                throw ApiError.BadRequestExeption(
                    'Пользователь с таким номером телефона уже существует',
                );
            } else if (isExistUser.email === req.body.email) {
                throw ApiError.BadRequestExeption('Пользователь с такой почтой уже существует');
            }
        }

        const passwordHash = await argon2.hash(req.body.password);

        const newUser = new User({
            name: req.body.name,
            last_name: req.body.last_name,
            middle_name: req.body.middle_name,
            email: req.body.email,
            phone: req.body.phone,
            passwordHash,
        });

        const user = await newUser.save({ session });

        const userDto = new UserDto(user);

        const tokens = tokenService.generateTokens({ ...userDto });
        await tokenService.saveToken(userDto.id, tokens.refreshToken);

        await session.commitTransaction();
        session.endSession();

        return {
            user: userDto,
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
        };
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
};

export const login = async (req) => {
    try {
        const user = await User.findOne({
            $or: [{ phone: req.body.phone }, { email: req.body.email }],
        });

        if (!user) {
            throw ApiError.NotFoundExeption('Неверный телефон/почта или пароль.');
        }

        const passwordMatch = await argon2.verify(user.passwordHash, req.body.password);

        if (!passwordMatch) {
            throw ApiError.BadRequestExeption('Неверный телефон/почта или пароль.');
        }

        const userDto = new UserDto(user);

        const tokens = tokenService.generateTokens({ ...userDto });
        await tokenService.saveToken(userDto.id, tokens.refreshToken);

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
};

export const logout = async (refreshToken) => {
    try {
        const token = await tokenService.removeToken(refreshToken);
        return token;
    } catch (error) {
        throw error;
    }
};

export const getProfile = async (req) => {
    try {
        const user = await User.findById(req.userId);

        if (!user) {
            throw ApiError.NotFoundExeption('Пользователь не найден');
        }

        delete user._doc.passwordHash;

        return {
            success: true,
            ...user._doc,
        };
    } catch (error) {
        throw error;
    }
};

export const refresh = async (refreshToken) => {
    if (!refreshToken) {
        throw ApiError.UnauthorizedExeption();
    }
    const userData = tokenService.validateRefreshToken(refreshToken);
    const tokenFromDB = await tokenService.findToken(refreshToken);
    if (!userData || !tokenFromDB) {
        throw ApiError.UnauthorizedExeption();
    }
    const user = await User.findById(userData.id);

    const userDto = new UserDto(user);

    const tokens = tokenService.generateTokens({ ...userDto });
    await tokenService.saveToken(userDto.id, tokens.refreshToken);
    return { ...tokens, user: userDto };
};
