import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { ApiError } from '../exeptions/apiError.js';
import createFolderIfNotExists from '../utils/createFolderIfNotExists.js';

const projectsUploadPath = 'uploads/projects';
const portfoliosUploadPath = 'uploads/portfolios';

const storageProjects = multer.diskStorage({
    destination: (_, __, callback) => {
        callback(null, projectsUploadPath);
    },
    filename: (_, file, callback) => {
        const uniqueFilename = uuidv4() + '-' + file.originalname;
        callback(null, uniqueFilename);
    },
});

const storagePortfolios = multer.diskStorage({
    destination: (_, __, callback) => {
        callback(null, portfoliosUploadPath);
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

export const uploadProject = multer({
    storage: storageProjects,
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

export const uploadPortfolio = multer({
    storage: storagePortfolios,
    fileFilter,
    limits: {
        fileSize: 1024 * 1024 * 5,
    },
}).fields([
    {
        name: 'image',
        maxCount: 1,
    },
]);

export const handleProjectCreation = async (req, res, next) => {
    try {
        const projectId = uuidv4();
        await createFolderIfNotExists(projectsUploadPath);

        req.projectId = projectId;

        next();
    } catch (error) {
        next(error);
    }
};

export const handlePortfolioCreation = async (req, res, next) => {
    try {
        const portfolioId = uuidv4();
        await createFolderIfNotExists(portfoliosUploadPath);

        req.portfolioId = portfolioId;

        next();
    } catch (error) {
        next(error);
    }
};
