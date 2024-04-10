import { Router } from 'express';
import authRoute from './auth.js';
import portfolioRoute from './portfolios.js';
import projectsRoute from './projects.js';

const router = new Router();

router.use(authRoute);
router.use(projectsRoute);
router.use(portfolioRoute);

export default router;
