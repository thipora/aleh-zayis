import express from 'express';
import { SummaryController } from '../controllers/SummaryController.js';
import { verifyToken } from "../middleware/authenticateToken.js";

const summaryRouter = express.Router();
const summaryController = new SummaryController();

summaryRouter.get('/byMonth/:employeeId', verifyToken, summaryController.getSummaryByMonth);
summaryRouter.get('/byBook/:employeeId', verifyToken, summaryController.getSummaryByBook);

export default summaryRouter;
