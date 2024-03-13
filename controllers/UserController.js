import argon2 from 'argon2';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import User from '../models/User.js';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

export const register = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const isExistUser = await User.findOne({
            $or: [{ phone: req.body.phone }, { email: req.body.email }],
        });

        if (isExistUser) {
            if (isExistUser.email === req.body.email && isExistUser.phone === req.body.phone) {
                return res.status(400).json({ message: 'Пользователь уже существует' });
            }
            if (isExistUser.phone === req.body.phone) {
                return res
                    .status(400)
                    .json({ message: 'Пользователь с таким номером телефона уже существует' });
            } else if (isExistUser.email === req.body.email) {
                return res
                    .status(400)
                    .json({ message: 'Пользователь с такой почтой уже существует' });
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

        delete user._doc.passwordHash;

        const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
            expiresIn: '1h',
        });

        await session.commitTransaction();
        session.endSession();

        return res
            .status(201)
            .json({ success: true, message: 'Регистрация прошла успешно', ...user._doc, token });
    } catch (error) {
        console.error('Ошибка при регистрации:', error.message);
        await session.abortTransaction();
        session.endSession();
        return res.status(500).json({ message: 'Не удалось зарегистрироватся.' });
    }
};

export const login = async (req, res) => {
    try {
        const user = await User.findOne({
            $or: [{ phone: req.body.phone }, { email: req.body.email }],
        });

        if (!user) {
            return res.status(404).json({ message: 'Неверный телефон/почта или пароль.' });
        }

        const passwordMatch = await argon2.verify(user.passwordHash, req.body.password);

        if (!passwordMatch) {
            return res.status(400).json({ message: 'Неверный телефон/почта или пароль.' });
        }

        const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
            expiresIn: '1h',
        });

        return res
            .status(200)
            .json({ success: true, message: 'Авторизация прошла успешно', token });
    } catch (error) {
        console.error('Ошибка при авторизации:', error.message);
        return res.status(500).json({ message: 'Не удалось авторизоватся.' });
    }
};

export const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.userId);

        if (!user) {
            return res.status(404).json({
                message: 'Пользователь не найден',
            });
        }

        delete user._doc.passwordHash;

        res.status(200).json({
            success: true,
            ...user._doc,
        });
    } catch (error) {
        console.error('Ошибка при получении профиля:', error.message);
        return res.status(500).json({ message: 'Нет доступа.' });
    }
};
