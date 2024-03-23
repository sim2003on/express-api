import fs from 'fs';

export default async function createFolderIfNotExists(folderPath) {
    try {
        await fs.promises.access(folderPath, fs.constants.F_OK);
    } catch (error) {
        if (error.code === 'ENOENT') {
            try {
                await fs.promises.mkdir(folderPath, { recursive: true });
            } catch (err) {
                throw new Error(`Ошибка создания папки ${folderPath}: ${err.message}`);
            }
        } else {
            throw new Error(`Ошибка доступа к папке ${folderPath}: ${error.message}`);
        }
    }
}
