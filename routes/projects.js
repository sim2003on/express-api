import { Router } from 'express';
import projectController from '../controllers/projectController.js';
import { handleProjectCreation, uploadProject } from '../middleware/uploadMiddleware.js';
import checkAuth from '../utils/checkAuth.js';

const router = new Router();

router.post(
    '/projects',
    checkAuth,
    handleProjectCreation,
    uploadProject,
    projectController.createProject,
);

router.get('/projects', projectController.getAllProjects);
router.get('/projects/:id', projectController.getOneProject);
router.patch('/projects/:id', checkAuth, uploadProject, projectController.updateProject);
router.delete('/projects/:id', checkAuth, projectController.removeProject);

export default router;
