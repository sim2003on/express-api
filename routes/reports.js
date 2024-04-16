import { Router } from 'express';
import reportController from '../controllers/reportController.js';
import checkAuth from '../utils/checkAuth.js';
import handleValidationErrors from '../utils/handleValidationErrors.js';
import { reportValidator } from '../validations/reports.js';

const router = new Router();

router.post(
    '/reports',
    checkAuth,
    reportValidator,
    handleValidationErrors,
    reportController.createReport,
);

router.get('/reports/:id', checkAuth, reportController.getOneReport);

router.get('/reports', checkAuth, reportController.getAllReports);

router.delete('/reports/:id', checkAuth, reportController.removeReport);

router.delete('/reports', checkAuth, reportController.removeAllReports);

export default router;
