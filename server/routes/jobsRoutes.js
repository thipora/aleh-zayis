import express from 'express';
import { JobsController } from '../controllers/jobsController.js';

const jobRouter = express.Router();
const jobsController = new JobsController();

jobRouter.get('/:userId', jobsController.getJobsByUser);

export default jobRouter;
