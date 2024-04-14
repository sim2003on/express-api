import { Router } from 'express';
import adminController from '../controllers/adminController.js';
import checkAuth from '../utils/checkAuth.js';
import handleValidationErrors from '../utils/handleValidationErrors.js';
import {
    forgotPasswordValidator,
    loginValidator,
    registerValidator,
    resetPasswordValidator,
} from '../validations/auth.js';

const router = new Router();

router.post('/auth/register', registerValidator, handleValidationErrors, adminController.register);

router.post('/auth/login', loginValidator, handleValidationErrors, adminController.login);

router.get('/auth/profile', checkAuth, adminController.getProfile);

router.post('/auth/logout', checkAuth, adminController.logout);

router.get('/auth/activate/:link', adminController.activateAccount);

router.get('/auth/refresh', checkAuth, adminController.refreshToken);

router.post(
    '/forgot-password',
    forgotPasswordValidator,
    handleValidationErrors,
    adminController.forgotPassword,
);

router.post(
    '/reset-password',
    resetPasswordValidator,
    handleValidationErrors,
    adminController.resetPassword,
);

export default router;
