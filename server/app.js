import express from 'express';
import { authRouters } from './routes/authRouters.js';
import workEntrieRouter from './routes/workEntriesRoutes.js';
import bookRouter from './routes/bookRouters.js';
import dotenv from 'dotenv';
import cors from 'cors';
import { logErrors } from './middleware/logError.js';
import rolesRouter from './routes/rolesRouter.js';
import employeeRoute from './routes/employeeRoutes.js';
import summaryRouter from './routes/summaryRouter.js';
import reportsRouter from './routes/reportsRouter.js';
import './cron/bookCron.js';


dotenv.config();

const app = express();

app.use(express.json());

app.use(cors({
  origin: true,
  credentials: true // זה חשוב אם הבקשה מהקליינט כוללת cookies או כל מידע מזהה
}));

app.use('/auth', authRouters);
app.use('/workEntries', workEntrieRouter);
app.use('/books', bookRouter);
// app.use('/employees', employeeRoute);
app.use('/summary', summaryRouter);
app.use('/roles', rolesRouter);
app.use('/reports', reportsRouter);



app.use(logErrors);


const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
