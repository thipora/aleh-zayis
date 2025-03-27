import express from 'express';
import { JobsController } from '../controllers/jobsController.js';

const jobRouter = express.Router();
const jobsController = new JobsController();

jobRouter.get('/:userId', jobsController.getJobsByUser);
jobRouter.put('/:jobId', jobsController.updateJob); // עדכון עבודה לפי מזהה עבודה
jobRouter.post('/:userId', JobsController.prototype.createJob); // להוספת עבודה חדשה



export default jobRouter;
