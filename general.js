import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import fs from 'fs';
import https from 'https';
import mongoose from 'mongoose';

import { logger } from './logger/index.js';

import { errorMiddleware } from './middleware/errorMiddleware.js';
import router from './routes/index.js';

dotenv.config();

const PORT = process.env.PORT;

const app = express();

app.use('/uploads', express.static('uploads'));

app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.disable('x-powered-by');
app.use('/api', router);
app.use('/uploads', express.static('uploads'));
app.use(errorMiddleware);

const options = {
    key: fs.readFileSync('./ssl/privkey.pem'),
    cert: fs.readFileSync('./ssl/cert.pem'),
};

const server = https.createServer(options, app);
const runServer = async () => {
    try {
        await mongoose.connect(process.env.DB_URL);
        server.listen(PORT, () => {
            logger.info(`Server listening at https://localhost:${PORT}`);
        });
    } catch (error) {
        console.error(error);
    }
};

runServer();
