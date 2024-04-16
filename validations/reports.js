import { body } from 'express-validator';

export const reportValidator = [
    body('firstName').notEmpty().withMessage('Имя обязательно для заполнения'),
    body('lastName').notEmpty().withMessage('Фамилия обязательна для заполнения'),
    body('middleName').notEmpty().withMessage('Отчество обязательно для заполнения'),
    body('managerLastName').notEmpty().withMessage('Фамилия менеджера обязательна для заполнения'),
    body('bankName').notEmpty().withMessage('Название банка обязательно для заполнения'),
    body('leadSource').notEmpty().withMessage('Источник лида обязателен для заполнения'),
    body('stages').notEmpty().withMessage('Этапы обязательны для заполнения'),
    body('area_sqm')
        .notEmpty()
        .isNumeric()
        .withMessage('Площадь должна быть числом и обязательна для заполнения'),
    body('price_per_sqm')
        .notEmpty()
        .isNumeric()
        .withMessage('Цена за квадратный метр должна быть числом и обязательна для заполнения'),
    body('netProfit_rub')
        .notEmpty()
        .isNumeric()
        .withMessage('Чистая прибыль должна быть числом и обязательна для заполнения'),
];
