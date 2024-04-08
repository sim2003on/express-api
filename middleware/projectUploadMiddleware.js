import multer from 'multer';
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

export { handleProjectCreation, upload };
