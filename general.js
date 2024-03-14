import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import { logger } from './logger/index.js';

import { errorMiddleware } from './middleware/errorMiddleware.js';
import router from './routes/index.js';

dotenv.config();

// Config
const PORT = process.env.PORT;

// Init
const app = express();

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use('/api', router);
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

// Start server
runServer();
