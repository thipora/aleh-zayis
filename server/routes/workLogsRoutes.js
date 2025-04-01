import express from 'express';
import { WorkLogsController } from '../controllers/workLogsController.js';

const workLogRouter = express.Router();
const workLogsController = new WorkLogsController();

workLogRouter.get('/:userId', workLogsController.getWorkLogsByUser);
workLogRouter.put('/:jobId', workLogsController.updateWorkLog); // עדכון עבודה לפי מזהה עבודה
workLogRouter.post('/:userId', workLogsController.prototype.createWorkLog); // להוספת עבודה חדשה



export default workLogRouter;
