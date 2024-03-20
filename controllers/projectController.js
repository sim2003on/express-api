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
    } catch (error) {}
};

export const updateProject = async (req, res, next) => {
    try {
    } catch (error) {}
};

export const removeProject = async (req, res, next) => {
    try {
    } catch (error) {}
};

export const uploadFile = async (req, res, next) => {
    try {
        const result = await projectService.uploadFile(req);
        res.json(result);
    } catch (error) {
        console.error(error);
    }
};
