import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';

import { logger } from './logger/index.js';

import { errorMiddleware } from './middleware/errorMiddleware.js';
import router from './routes/index.js';

dotenv.config();

const PORT = process.env.PORT;

const app = express();

app.use('/uploads', express.static('uploads'));

app.use(express.json());
app.use(
    cors({
        credentials: true,
        origin: process.env.CLIENT_URL,
    }),
);
app.use(cookieParser());
app.disable('x-powered-by');
app.use('/api', router);
app.use('/uploads', express.static('uploads'));
app.use(errorMiddleware);

const runServer = async () => {
    try {
        await mongoose.connect(process.env.DB_URL);
        app.listen(PORT, () => {
            logger.info(`Server listening at http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error(error);
    }
};

runServer();
