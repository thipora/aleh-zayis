import express from 'express';
import { authRouters } from './routes/authRouters.js';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();

app.use(express.json());

app.use(cors());

app.use('/authentication',authRouters);


const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
