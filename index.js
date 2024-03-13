import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';

import router from './routes/router.js';

dotenv.config();

// Config
const PORT = process.env.PORT;
const DB_USERNAME = process.env.DB_USERNAME;
const DB_PASSWORD = process.env.DB_PASSWORD;

// Connect to db
mongoose
    .connect(
        `mongodb+srv://${DB_USERNAME}:${DB_PASSWORD}@cluster0.pxzm9xe.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`,
    )
    .then(() => console.log('connected to db'))
    .catch((err) => console.error(err));

// Init
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use('/api', router);

// Start server
app.listen(PORT, () => {
    try {
        console.log(`Server is running on port ${PORT}`);
    } catch (error) {
        console.error(error);
    }
});
