import * as projectService from '../services/projectService.js';

export const createProject = async (req, res, next) => {
    try {
        const projectData = await projectService.createProject(req);

        return res.status(201).json({ message: 'Проект успешно создан', projectData });
    } catch (error) {
        next(error);
    }
};

export const getAllProjects = async (req, res, next) => {
    try {
        const projects = await projectService.getAllProjects();
        return res.status(200).json(projects);
    } catch (error) {
        next(error);
    }
};

export const getOneProject = async (req, res, next) => {
    try {
        const projectId = req.params.id;
        const project = await projectService.getOneProject(projectId);
        return res.status(200).json(project);
    } catch (error) {
        next(error);
    }
};

export const updateProject = async (req, res, next) => {
    try {
        const projectId = req.params.id;
        const newData = req.body?.newData || null;

        const updatedProject = await projectService.updateProject(projectId, newData, req);

        return res.status(200).json(updatedProject);
    } catch (error) {
        next(error);
    }
};

export const removeProject = async (req, res, next) => {
    try {
        const projectId = req.params.id;
        await projectService.removeProject(projectId);
        return res.status(200).json({ message: 'Проект успешно удален' });
    } catch (error) {
        next(error);
    }
};
