import fs from 'fs/promises';
import path from 'path';
import { ProjectDto } from '../dto/projectDto.js';
import { ApiError } from '../exeptions/apiError.js';

import projectModel from '../models/projectModel.js';
import createFolderIfNotExists from '../utils/createFolderIfNotExists.js';
import { deleteFilesIfError, deleteOldFile } from '../utils/deleteFiles.js';

const uploadPath = 'uploads/projects/';

class ProjectService {
    async createProject(req) {
        try {
            if (!req.files || !req.body.data) {
                throw ApiError.BadRequestExeption('Нет файлов или данных проекта');
            }

            const projectData = JSON.parse(req.body.data);

            const mainImage = req.files['mainImage'] ? req.files['mainImage'][0] : null;
            const planImage = req.files['planImage'] ? req.files['planImage'][0] : null;

            if (!mainImage || !planImage) {
                throw ApiError.BadRequestExeption('Нет файлов');
            }

            const projectId = req.projectId;
            const projectFolder = path.join(uploadPath, projectId);

            await Promise.all([
                createFolderIfNotExists(uploadPath),
                createFolderIfNotExists(projectFolder),
                createFolderIfNotExists(path.join(projectFolder, 'mainImage')),
                createFolderIfNotExists(path.join(projectFolder, 'planImage')),
            ]);

            await fs.rename(
                mainImage.path,
                path.join(projectFolder, 'mainImage', mainImage.filename),
            );
            await fs.rename(
                planImage.path,
                path.join(projectFolder, 'planImage', planImage.filename),
            );

            const newProject = new projectModel({
                ...projectData,
                projectFolder: projectId,
                mainImgURL: path.join(
                    'uploads/projects',
                    projectId,
                    'mainImage',
                    mainImage.filename,
                ),
                mainImgFileName: mainImage.filename,
                planImgURL: path.join(
                    'uploads/projects',
                    projectId,
                    'planImage',
                    planImage.filename,
                ),
                planImgFileName: planImage.filename,
            });

            await newProject.save();
            return new ProjectDto(newProject);
        } catch (error) {
            if (req.files['mainImage']) {
                deleteFilesIfError(uploadPath, req.files['mainImage'][0].filename);
            }
            if (req.files['planImage']) {
                deleteFilesIfError(uploadPath, req.files['planImage'][0].filename);
            }
            console.error(error);
            throw error;
        }
    }

    async getAllProjects(region) {
        try {
            const projects = await projectModel.find(region ? { region: region } : {});

            if (projects.length === 0) {
                throw ApiError.NotFoundExeption('Проекты не найдены');
            }
            const projectDto = projects.map((project) => new ProjectDto(project));
            return projectDto;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async getOneProject(id) {
        try {
            const project = await projectModel.findById(id);
            if (!project) {
                throw ApiError.NotFoundExeption('Проект не найден');
            }
            const projectDto = new ProjectDto(project);
            return projectDto;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async updateProject(id, data, req) {
        try {
            const project = await projectModel.findById(id);

            if (!project) {
                throw ApiError.NotFoundExeption('Проект не найден');
            }

            const mainImage = req.files['mainImage'] ? req.files['mainImage'][0] : null;
            const planImage = req.files['planImage'] ? req.files['planImage'][0] : null;

            if (mainImage) {
                deleteOldFile(
                    uploadPath,
                    project.projectFolder + '/mainImage/',
                    project.mainImgFileName,
                );
                await fs.rename(
                    mainImage.path,
                    path.join(uploadPath, project.projectFolder, 'mainImage', mainImage.filename),
                );
            }

            if (planImage) {
                deleteOldFile(
                    uploadPath,
                    project.projectFolder + '/planImage/',
                    project.planImgFileName,
                );
                await fs.rename(
                    planImage.path,
                    path.join(uploadPath, project.projectFolder, 'planImage', planImage.filename),
                );
            }

            const newData = {
                ...(data && JSON.parse(data)),
                ...(mainImage && {
                    mainImgURL: path.join(
                        uploadPath,
                        project.projectFolder,
                        'mainImage',
                        mainImage.filename,
                    ),
                    mainImgFileName: mainImage.filename,
                }),
                ...(planImage && {
                    planImgURL: path.join(
                        uploadPath,
                        project.projectFolder,
                        'planImage',
                        planImage.filename,
                    ),
                    planImgFileName: planImage.filename,
                }),
            };

            const updatedProject = await projectModel.findByIdAndUpdate(id, newData, { new: true });

            const projectDto = new ProjectDto(updatedProject);

            return projectDto;
        } catch (error) {
            if (req.files['mainImage']) {
                deleteFilesIfError(uploadPath, req.files['mainImage'][0].filename);
            }
            if (req.files['planImage']) {
                deleteFilesIfError(uploadPath, req.files['planImage'][0].filename);
            }
            console.error(error);
            throw error;
        }
    }

    async removeProject(id) {
        try {
            const project = await projectModel.findById(id);
            if (!project) {
                throw ApiError.NotFoundExeption('Проект не найден');
            }
            const projectFolderPath = path.join(uploadPath, project.projectFolder);

            await fs.access(projectFolderPath);
            await fs.rm(projectFolderPath, { recursive: true, force: true });
            await projectModel.findByIdAndDelete(id);
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}

export default new ProjectService();
