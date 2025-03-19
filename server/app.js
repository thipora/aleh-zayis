import express from 'express';
import { authRouters } from './routes/authRouters.js';
import jobRouter from './routes/jobsRoutes.js';
import dotenv from 'dotenv';
import cors from 'cors';
import { logErrors } from './middleware/logError.js';

dotenv.config();

const app = express();

app.use(express.json());

app.use(cors());

app.use('/auth', authRouters);
app.use('/worklogs', jobRouter);

app.use(logErrors);


const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
