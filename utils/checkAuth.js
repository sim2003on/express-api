import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

export default (req, res, next) => {
    const token = (req.headers.authorization || '').replace('Bearer ', '');

    if (token) {
        try {
            const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

            req.userId = decodedToken._id;
        } catch (error) {
            return res.status(403).json({ message: 'Нет доступа.' });
        }
    }

    next();
};
