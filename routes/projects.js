import { Router } from 'express';
import * as projectController from '../controllers/projectController.js';
import checkAuth from '../utils/checkAuth.js';

import {
    handleProjectCreation,
    moveFileToDestination,
    upload,
} from '../middleware/projectUploadMiddleware.js';

const router = new Router();

router.post(
    '/projects',
    checkAuth,
    handleProjectCreation,
    upload.fields([
        { name: 'mainImage', maxCount: 1 },
        { name: 'planImage', maxCount: 1 },
    ]),
    moveFileToDestination,
    projectController.createProject,
);
router.get('/projects', projectController.getAllProjects);
router.get('/projects/:id', projectController.getOneProject);
router.patch('/projects/:id', checkAuth, projectController.updateProject);
router.delete('/projects/:id', checkAuth, projectController.removeProject);

export default router;
