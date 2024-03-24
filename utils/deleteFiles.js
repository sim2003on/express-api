import fs from 'fs/promises';
import path from 'path';

export const deleteFilesIfError = async (fileName) => {
    const uploadPath = 'uploads/projects';
    const filePath = path.join(uploadPath, fileName);

    try {
        await fs.access(filePath);
        await fs.unlink(filePath);
    } catch (error) {
        console.error(error);
    }
};

export const deleteOldFile = async (projectFolder, filename) => {
    const uploadPath = 'uploads/projects';
    const projectPath = path.join(uploadPath, projectFolder);
    const filePath = path.join(projectPath, filename);

    try {
        await fs.access(filePath);
        await fs.unlink(filePath);
    } catch (error) {
        console.error(error);
    }
};
