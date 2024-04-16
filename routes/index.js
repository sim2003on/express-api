import { Router } from 'express';
import authRoute from './auth.js';
import portfoliosRoute from './portfolios.js';
import projectsRoute from './projects.js';
import reportsRoute from './reports.js';

const router = new Router();

router.use(authRoute);
router.use(projectsRoute);
router.use(portfoliosRoute);
router.use(reportsRoute);

export default router;
