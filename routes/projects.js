import { Router } from 'express';
import * as ProjectController from '../controllers/projectController.js';
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
    upload,
    moveFileToDestination,
    ProjectController.createProject,
);
router.get('/projects', ProjectController.getAllProjects);
router.get('/projects/:id', ProjectController.getOneProject);
router.patch(
    '/projects/:id',
    checkAuth,
    upload,
    moveFileToDestination,
    ProjectController.updateProject,
);
router.delete('/projects/:id', checkAuth, ProjectController.removeProject);

export default router;
