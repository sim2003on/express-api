import projectService from '../services/projectService.js';

class ProjectController {
    async createProject(req, res, next) {
        try {
            const projectData = await projectService.createProject(req);

            return res.status(201).json({ message: 'Проект успешно создан', projectData });
        } catch (error) {
            next(error);
        }
    }
    async getAllProjects(req, res, next) {
        try {
            const projects = await projectService.getAllProjects();
            return res.status(200).json(projects);
        } catch (error) {
            next(error);
        }
    }
    async getOneProject(req, res, next) {
        try {
            const projectId = req.params.id;
            const project = await projectService.getOneProject(projectId);
            return res.status(200).json(project);
        } catch (error) {
            next(error);
        }
    }
    async updateProject(req, res, next) {
        try {
            const projectId = req.params.id;
            const newData = req.body?.newData || null;

            const updatedProject = await projectService.updateProject(projectId, newData, req);

            return res.status(200).json(updatedProject);
        } catch (error) {
            next(error);
        }
    }
    async removeProject(req, res, next) {
        try {
            const projectId = req.params.id;
            await projectService.removeProject(projectId);
            return res.status(200).json({ message: 'Проект успешно удален' });
        } catch (error) {
            next(error);
        }
    }
}

export default new ProjectController();
