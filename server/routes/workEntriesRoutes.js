import express from 'express';
import { WorkEntriesController } from '../controllers/workEntriesController.js';

const workEntrieRouter = express.Router();
const workEntriesController = new WorkEntriesController(); // יצירת מופע של WorkEntriesController

workEntrieRouter.get('/:employeeId', workEntriesController.getWorkEntriesByUser); // שליחה לפונקציה של המופע
workEntrieRouter.put('/:WorkEntrieId', workEntriesController.updateWorkEntrie); // שליחה לפונקציה של המופע
// workEntrieRouter.post('/:employeeId', workEntriesController.createWorkEntrie); // שליחה לפונקציה של המופע

export default workEntrieRouter;

