import { Router } from 'express';
import portfolioController from '../controllers/portfolioController.js';
import { handlePortfolioCreation, uploadPortfolio } from '../middleware/projectUploadMiddleware.js';
import checkAuth from '../utils/checkAuth.js';

const router = new Router();

router.post(
    '/portfolio',
    checkAuth,
    handlePortfolioCreation,
    uploadPortfolio,
    portfolioController.createPortfolio,
);

router.get('/portfolio', portfolioController.getAllPortfolios);

router.get('/portfolio/:id', portfolioController.getOnePortfolio);

router.patch('/portfolio/:id', checkAuth, uploadPortfolio, portfolioController.updatePortfolio);

router.delete('/portfolio/:id', checkAuth, portfolioController.removePortfolio);

export default router;
