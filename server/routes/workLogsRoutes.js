// import express from 'express';
// import WorkLogsController from '../controllers/workLogsController.js';

// const workLogRouter = express.Router();
// const workLogsController = new WorkLogsController();

// workLogRouter.get('/:userId', workLogsController.getWorkLogsByUser);
// workLogRouter.put('/:jobId', workLogsController.updateWorkLog);
// workLogRouter.post('/:userId', workLogsController.prototype.createWorkLog);



// export default workLogRouter;


import express from 'express';
import { WorkLogsController } from '../controllers/workLogsController.js';

const workLogRouter = express.Router();
const workLogsController = new WorkLogsController(); // יצירת מופע של WorkLogsController

workLogRouter.get('/:userId', workLogsController.getWorkLogsByUser); // שליחה לפונקציה של המופע
workLogRouter.put('/:WorkLogId', workLogsController.updateWorkLog); // שליחה לפונקציה של המופע
workLogRouter.post('/:userId', workLogsController.createWorkLog); // שליחה לפונקציה של המופע

export default workLogRouter;

