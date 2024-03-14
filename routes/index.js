import { Router } from 'express';
import authRoute from './auth.js';

const router = new Router();

router.use(authRoute);

export default router;
