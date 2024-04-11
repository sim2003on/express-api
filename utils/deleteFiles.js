import fs from 'fs/promises';
import path from 'path';

export const deleteFilesIfError = async (uploadPath, fileName) => {
    const filePath = path.join(uploadPath, fileName);
    try {
        await fs.access(filePath);
        await fs.unlink(filePath);
    } catch (error) {
        console.error(error);
    }
};

export const deleteOldFile = async (uploadPath, folder, filename) => {
    const folderPath = path.join(uploadPath, folder);
    const filePath = path.join(folderPath, filename);
    try {
        await fs.access(filePath);
        await fs.unlink(filePath);
    } catch (error) {
        console.error(error);
    }
};
