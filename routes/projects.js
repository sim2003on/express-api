import { Router } from 'express';
import projectController from '../controllers/projectController.js';
import { handleProjectCreation, upload } from '../middleware/projectUploadMiddleware.js';
import checkAuth from '../utils/checkAuth.js';

const router = new Router();

router.post('/projects', checkAuth, handleProjectCreation, upload, projectController.createProject);

router.get('/projects', projectController.getAllProjects);

router.get('/projects/:id', projectController.getOneProject);

router.patch('/projects/:id', checkAuth, upload, projectController.updateProject);

router.delete('/projects/:id', checkAuth, projectController.removeProject);

export default router;
