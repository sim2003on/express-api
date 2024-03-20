import fs from 'fs';
import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const storage = multer.diskStorage({
    destination: (_, __, callback) => {
        callback(null, 'uploads/projects');
    },
    filename: (_, file, callback) => {
        callback(null, file.originalname);
    },
});

const fileFilter = (_, file, callback) => {
    if (file.mimetype.startsWith('image/')) {
        callback(null, true);
    } else {
        callback(new Error('Only images are allowed!'), false);
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 1024 * 1024 * 5,
    },
});

const handleProjectCreation = (req, res, next) => {
    const projectId = uuidv4();
    const projectFolder = path.join('uploads/projects', projectId);
    createFolderIfNotExists('uploads');
    createFolderIfNotExists('uploads/projects');
    createFolderIfNotExists(projectFolder);
    createFolderIfNotExists(path.join(projectFolder, 'mainImage'));
    createFolderIfNotExists(path.join(projectFolder, 'planImage'));
    req.projectId = projectId;
    next();
};

const createFolderIfNotExists = (folderPath) => {
    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
    }
};

const moveFileToDestination = (req, res, next) => {
    if (!req.files || !req.projectId) {
        return res.status(400).json({ message: 'Нет файлов или идентификатора проекта' });
    }

    const mainImage = req.files['mainImage'][0];
    const planImage = req.files['planImage'][0];
    req.mainImageName = mainImage.originalname;
    req.planImageName = planImage.originalname;

    if (!mainImage || !planImage) {
        return res.status(400).json({ message: 'Нет основного файла или плана' });
    }

    const projectFolder = path.join('uploads/projects', req.projectId);

    fs.renameSync(mainImage.path, path.join(projectFolder, 'mainImage', mainImage.originalname));
    fs.renameSync(planImage.path, path.join(projectFolder, 'planImage', planImage.originalname));

    next();
};
export { handleProjectCreation, moveFileToDestination, upload };
