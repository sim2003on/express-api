import { body, oneOf } from 'express-validator';

export const registerValidator = [
    body('login', 'Длина имени не может быть меньше 3 или больше 50 символов').isLength({
        min: 3,
        max: 50,
    }),
    body('email', 'Неверный формат почты')
        .isLength({ min: 5, max: 50 })
        .withMessage('Длина почты не может быть меньше 5 или больше 50 символов')
        .isEmail(),
    body('password', 'Пароль должен быть больше 6').isLength({ min: 6 }),
    body('role', 'Неверный формат роли').isIn(['user', 'admin', 'superadmin']),
    body('region', 'Неверный формат региона').isIn([
        '61',
        '36',
        '23',
        '93',
        '123',
        '34',
        '48',
        '43',
        '71',
    ]),
];

export const loginValidator = [
    oneOf([
        body('login', 'Неверный формат логина').isLength({ min: 6 }),
        body('email', 'Неверный формат почты')
            .isLength({ min: 6 })
            .withMessage('Длина почты не может быть меньше 6')
            .isEmail(),
    ]),
    body('password', 'Пароль должен быть больше 6').isLength({ min: 6 }),
];

export const forgotPasswordValidator = [
    body('email', 'Неверный формат почты')
        .isLength({ min: 5, max: 50 })
        .withMessage('Длина почты не может быть меньше 5 или больше 50 символов')
        .isEmail(),
];

export const resetPasswordValidator = [
    body('password', 'Пароль должен быть больше 6').isLength({ min: 6 }),
    body('token', 'Неверный формат токена').isLength({ min: 6 }),
];
