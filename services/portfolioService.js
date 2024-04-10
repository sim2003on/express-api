import fs from 'fs/promises';
import path from 'path';
import { PortfolioDto } from '../dto/portfolioDto.js';
import { ApiError } from '../exeptions/apiError.js';
import portfolioModel from '../models/portfolioModel.js';
import createFolderIfNotExists from '../utils/createFolderIfNotExists.js';
import { deleteFilesIfError, deleteOldFile } from '../utils/deleteFiles.js';

const uploadPath = 'uploads/portfolios/';

class PortfolioService {
    async createPortfolio(req) {
        try {
            if (!req.files || !req.body.data) {
                throw ApiError.BadRequestExeption('Нет файлов или данных для портфолио');
            }

            const isIndividual = req.body.isIndividual || false;

            const portfolioData = JSON.parse(req.body.data);

            const image = req.files['image'] ? req.files['image'][0] : null;

            if (!image) {
                throw ApiError.BadRequestExeption('Нет файлов');
            }

            const portfolioId = req.portfolioId;
            const portfolioFolder = path.join(uploadPath, portfolioId);

            await Promise.all([
                createFolderIfNotExists(uploadPath),
                createFolderIfNotExists(portfolioFolder),
            ]);

            await fs.rename(image.path, path.join(portfolioFolder, image.filename));

            const newPortfolio = new portfolioModel({
                ...portfolioData,
                portfolioFolder: portfolioId,
                imgName: image.filename,
                isIndividual: isIndividual,
                imgURL: `uploads/portfolios/${portfolioId}/${image.filename}`,
                imgFileName: image.filename,
            });

            await newPortfolio.save();
            return new PortfolioDto(newPortfolio);
        } catch (error) {
            const image = req.files['image'] ? req.files['image'][0] : null;
            if (image) {
                deleteFilesIfError(uploadPath, image.filename);
            }
            console.error(error);
            throw error;
        }
    }

    async getAllPortfolios() {
        try {
            const portfolios = await portfolioModel.find();
            if (portfolios.length === 0) {
                throw ApiError.NotFoundExeption('Список портфолип пуст');
            }
            return portfolios.map((portfolio) => new PortfolioDto(portfolio));
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async getOnePortfolio(id) {
        try {
            const portfolio = await portfolioModel.findById(id);
            if (!portfolio) {
                throw ApiError.NotFoundExeption('Портфолио не найдено');
            }
            return new PortfolioDto(portfolio);
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async updatePortfolio(id, data, req) {
        try {
            const portfolio = await portfolioModel.findById(id);

            if (!portfolio) {
                throw ApiError.NotFoundExeption('Портфолио не найден');
            }

            const image = req.files['image'] ? req.files['image'][0] : null;

            if (image) {
                deleteOldFile(uploadPath, portfolio.portfolioFolder, portfolio.imgName);
                await fs.rename(
                    image.path,
                    path.join(uploadPath, portfolio.portfolioFolder, image.filename),
                );
            }

            const newData = {
                ...(data && JSON.parse(data)),
                ...(image && {
                    imgURL: path.join(uploadPath, portfolio.portfolioFolder, image.filename),
                    imgName: image.filename,
                }),
            };

            const updatedPortfolio = await portfolioModel.findByIdAndUpdate(id, newData, {
                new: true,
            });

            return new PortfolioDto(updatedPortfolio);
        } catch (error) {
            const image = req.files['image'] ? req.files['image'][0] : null;
            if (image) {
                deleteFilesIfError(uploadPath, image.filename);
            }
            console.error(error);
            throw error;
        }
    }

    async removePortfolio(id) {
        const portfolio = await portfolioModel.findById(id);
        if (!portfolio) {
            throw ApiError.NotFoundExeption('Портфолио не найден');
        }
        const portfolioFolderPath = path.join(uploadPath, portfolio.portfolioFolder);

        await fs.access(portfolioFolderPath);
        await fs.rm(portfolioFolderPath, { recursive: true, force: true });
        await portfolioModel.findByIdAndDelete(id);
    }
}

export default new PortfolioService();
