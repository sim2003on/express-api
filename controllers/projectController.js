import { logger } from '../logger/index.js';
import projectService from '../services/projectService.js';

class ProjectController {
    async createProject(req, res, next) {
        try {
            const projectData = await projectService.create(req);
            return res.status(201).json({ message: 'Проект успешно создан', projectData });
        } catch (error) {
            logger.error({ err: error.message }, 'Ошибка при создании проекта:');
            next(error);
        }
    }

    async getAllProjects(req, res, next) {
        try {
            const region = req.query?.region;
            const projects = await projectService.getAll(region);
            return res.status(200).json(projects);
        } catch (error) {
            logger.error({ err: error.message }, 'Ошибка при получении проектов:');
            next(error);
        }
    }

    async getOneProject(req, res, next) {
        try {
            const projectId = req.params.id;
            const project = await projectService.getOne(projectId);
            return res.status(200).json(project);
        } catch (error) {
            logger.error({ err: error.message }, 'Ошибка при получении проекта:');
            next(error);
        }
    }

    async updateProject(req, res, next) {
        try {
            const projectId = req.params.id;
            const data = req.body?.data;
            const updatedProject = await projectService.update(projectId, data, req);
            return res.status(200).json({ message: 'Проект успешно обновлено', ...updatedProject });
        } catch (error) {
            logger.error({ err: error.message }, 'Ошибка при обновлении проекта:');
            next(error);
        }
    }

    async removeProject(req, res, next) {
        try {
            const projectId = req.params.id;
            await projectService.remove(projectId);
            return res.status(200).json({ message: 'Проект успешно удален' });
        } catch (error) {
            logger.error({ err: error.message }, 'Ошибка при удалении проекта:');
            next(error);
        }
    }
}

export default new ProjectController();
