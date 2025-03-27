import express from 'express';
import { authRouters } from './routes/authRouters.js';
import jobRouter from './routes/jobsRoutes.js';
import bookRouter from './routes/bookRouters.js';
import dotenv from 'dotenv';
import cors from 'cors';
import { logErrors } from './middleware/logError.js';

dotenv.config();

const app = express();

app.use(express.json());

// app.use(cors());

app.use(cors({
    origin: 'http://localhost:5173', // או כתובת האתר של ה-client שלך
    credentials: true // אפשר שליחת cookies או credentials אחרים
  }));

app.use('/auth', authRouters);
app.use('/worklogs', jobRouter);
app.use('/books', bookRouter);

app.use(logErrors);


const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
