import { Router } from 'express';
import * as UserController from '../controllers/userController.js';
import checkAuth from '../utils/checkAuth.js';
import handleValidationErrors from '../utils/handleValidationErrors.js';
import { loginValidator, registerValidator } from '../validations/auth.js';

const router = new Router();

router.post('/auth/register', registerValidator, handleValidationErrors, UserController.register);

router.post('/auth/login', loginValidator, handleValidationErrors, UserController.login);

router.get('/auth/profile', checkAuth, UserController.getProfile);

router.post('/auth/logout', checkAuth, UserController.logout);

router.get('/auth/refresh', checkAuth, UserController.refreshToken);

export default router;
