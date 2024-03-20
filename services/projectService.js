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
        return projects;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const getOneProject = async () => {
    try {
    } catch (error) {}
};

export const updateProject = async () => {
    try {
    } catch (error) {}
};

export const removeProject = async () => {
    try {
    } catch (error) {}
};

export const uploadFile = async (req) => {
    try {
        return {
            url: `${req.file.originalname}`,
        };
    } catch (error) {
        console.error(error);
    }
};
