import express from 'express';
import { SummaryController } from '../controllers/SummaryController.js';

const summaryRouter = express.Router();
const summaryController = new SummaryController();

summaryRouter.get('/byMonth/:employeeId', summaryController.getSummaryByMonth);
summaryRouter.get('/byBook/:employeeId', summaryController.getSummaryByBook);

export default summaryRouter;
