import { Router } from 'express';
import authRoute from './auth.js';
import projectsRoute from './projects.js';

const router = new Router();

router.use(authRoute);
router.use(projectsRoute);

export default router;
