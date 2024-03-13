import { body, oneOf } from 'express-validator';

export const registerValidator = [
    body('name', 'Длина имени не может быть меньше 1 или больше 50 символов')
        .isLength({ min: 1, max: 50 })
        .matches(/^[а-яА-ЯЁё]+$/)
        .withMessage('Имя может содержать только русские буквы'),
    body('last_name', 'Длина фамилии не может быть меньше 1 или больше 50 символов')
        .isLength({ min: 1, max: 50 })
        .matches(/^[а-яА-ЯЁё]+$/)
        .withMessage('Фамилия может содержать только русские буквы'),
    body('middle_name', 'Длина фамилии не может быть меньше 1 или больше 50 символов')
        .isLength({ min: 1, max: 50 })
        .matches(/^[а-яА-ЯЁё]+$/)
        .withMessage('Отчество может содержать только русские буквы'),
    body('email', 'Неверный формат почты')
        .isLength({ min: 5, max: 50 })
        .withMessage('Длина почты не может быть меньше 5 или больше 50 символов')
        .isEmail(),
    body('phone', 'Неверный формат номера телефона').isMobilePhone('ru-RU', { strictMode: false }),
    body('password', 'Пароль должен быть больше 6').isLength({ min: 6 }),
];

export const loginValidator = [
    oneOf([
        body('email', 'Неверный формат почты')
            .isLength({ min: 6 })
            .withMessage('Длина почты не может быть меньше 6')
            .isEmail(),
        body('phone', 'Неверный формат номера телефона').isMobilePhone('ru-RU', {
            strictMode: false,
        }),
    ]),
    body('password', 'Пароль должен быть больше 6').isLength({ min: 6 }),
];
