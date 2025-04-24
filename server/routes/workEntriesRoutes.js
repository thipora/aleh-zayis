import express from 'express';
import { WorkEntriesController } from '../controllers/workEntriesController.js';

const workEntrieRouter = express.Router();
const workEntriesController = new WorkEntriesController(); // יצירת מופע של WorkEntriesController

workEntrieRouter.get('/:employeeId', workEntriesController.getWorkEntriesByEmployee); // שליחה לפונקציה של המופע
workEntrieRouter.put('/:WorkEntrieId', workEntriesController.updateWorkEntrie); // שליחה לפונקציה של המופע
workEntrieRouter.post('/:employeeId', workEntriesController.createWorkEntry); // שליחה לפונקציה של המופע

export default workEntrieRouter;

