import fs from 'fs';
import { ApiError } from '../exeptions/apiError.js';
import projectModel from '../models/projectModel.js';

export const createProject = async (req) => {
    try {
        const data = JSON.parse(req.body.data);
        const mainImgUrl = `uploads/projects/${req.projectId}/mainImage/${req.mainImageName}`;
        const planImgUrl = `uploads/projects/${req.projectId}/planImage/${req.planImageName}`;

        const project = await projectModel.create({
            name: data.name,
            description: data.description,
            region: data.region,
            mainImgURL: mainImgUrl,
            planImgURL: planImgUrl,
            projectFolder: req.projectId,
            details: data.details,
        });
        await project.save();

        return project;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const getAllProjects = async () => {
    try {
        const projects = await projectModel.find();
        if (projects.length === 0) {
            throw ApiError.NotFoundExeption('Проекты не найдены');
        }
        return projects;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const getOneProject = async (id) => {
    try {
        const project = await projectModel.findById(id);
        if (!project) {
            throw ApiError.NotFoundExeption('Проект не найден');
        }
        return project;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const updateProject = async (id, newData, req) => {
    try {
        const project = await projectModel.findByIdAndUpdate(id, newData, { new: true });

        if (!project) {
            throw ApiError.NotFoundExeption('Проект не найден');
        }

        return project;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const removeProject = async (id) => {
    try {
        const project = await projectModel.findById(id);
        if (!project) {
            throw ApiError.NotFoundExeption('Проект не найден');
        }
        const projectFolderPath = `uploads/projects/${project.projectFolder}`;

        await fs.promises.access(projectFolderPath);
        await fs.promises.rm(projectFolderPath, { recursive: true, force: true });
        await projectModel.findByIdAndDelete(id);
    } catch (error) {
        console.error(error);
        throw error;
    }
};
