import { Router } from 'express';
import * as ProjectController from '../controllers/projectController.js';
import checkAuth from '../utils/checkAuth.js';

import { handleProjectCreation, upload } from '../middleware/projectUploadMiddleware.js';

const router = new Router();

router.post('/projects', handleProjectCreation, upload, ProjectController.createProject);
router.get('/projects', ProjectController.getAllProjects);
router.get('/projects/:id', ProjectController.getOneProject);
router.patch('/projects/:id', upload, ProjectController.updateProject);
router.delete('/projects/:id', ProjectController.removeProject);

export default router;
