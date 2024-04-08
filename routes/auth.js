import { Router } from 'express';
import adminController from '../controllers/adminController.js';
import checkAuth from '../utils/checkAuth.js';
import handleValidationErrors from '../utils/handleValidationErrors.js';
import { loginValidator, registerValidator } from '../validations/auth.js';

const router = new Router();

router.post('/auth/register', registerValidator, handleValidationErrors, adminController.register);

router.post('/auth/login', loginValidator, handleValidationErrors, adminController.login);

router.get('/auth/profile', checkAuth, adminController.getProfile);

router.post('/auth/logout', checkAuth, adminController.logout);

router.get('/auth/refresh', checkAuth, adminController.refreshToken);

export default router;
