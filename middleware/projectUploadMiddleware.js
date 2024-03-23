import fs from 'fs';
import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { ApiError } from '../exeptions/apiError.js';
import createFolderIfNotExists from '../utils/createFolderIfNotExists.js';

const uploadPath = 'uploads/projects';

const storage = multer.diskStorage({
    destination: (_, __, callback) => {
        callback(null, uploadPath);
    },
    filename: (_, file, callback) => {
        const uniqueFilename = uuidv4() + '-' + file.originalname;
        callback(null, uniqueFilename);
    },
});

const fileFilter = (_, file, callback) => {
    if (file.mimetype.startsWith('image/')) {
        callback(null, true);
    } else {
        callback(ApiError.BadRequestExeption('Только изображения разрешены'), false);
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 1024 * 1024 * 5,
    },
}).fields([
    {
        name: 'mainImage',
        maxCount: 1,
    },
    {
        name: 'planImage',
        maxCount: 1,
    },
]);

const handleProjectCreation = async (req, res, next) => {
    try {
        const projectId = uuidv4();
        await createFolderIfNotExists(uploadPath);

        req.projectId = projectId;
        next();
    } catch (error) {
        next(error);
    }
};

const deleteOldFile = (projectId, filename) => {
    const projectFolder = path.join(uploadPath, projectId);
    const filePath = path.join(projectFolder, filename);

    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
    }
};

const moveFileToDestination = async (req, res, next) => {
    try {
        if (!req.files || !req.projectId) {
            throw ApiError.BadRequestExeption('Нет файлов или идентификатора проекта');
        }

        const mainImage = req.files['mainImage'] ? req.files['mainImage'][0] : null;
        const planImage = req.files['planImage'] ? req.files['planImage'][0] : null;

        if (!mainImage && !planImage) {
            throw ApiError.BadRequestExeption('Нет файлов');
        }

        const projectFolder = path.join(uploadPath, req.projectId);

        await Promise.all([
            createFolderIfNotExists(projectFolder),
            createFolderIfNotExists(path.join(projectFolder, 'mainImage')),
            createFolderIfNotExists(path.join(projectFolder, 'planImage')),
        ]);

        if (mainImage) {
            deleteOldFile(req.projectId, 'mainImage/' + mainImage.filename);
            await fs.promises.rename(
                mainImage.path,
                path.join(projectFolder, 'mainImage', mainImage.filename),
            );
        }

        if (planImage) {
            deleteOldFile(req.projectId, 'planImage/' + planImage.filename);
            await fs.promises.rename(
                planImage.path,
                path.join(projectFolder, 'planImage', planImage.filename),
            );
        }

        req.mainImageName = mainImage ? mainImage.filename : null;
        req.planImageName = planImage ? planImage.filename : null;
        req.uploadPath = uploadPath;

        next();
    } catch (error) {
        next(error);
    }
};

export { handleProjectCreation, moveFileToDestination, upload };
