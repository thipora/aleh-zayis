import express from 'express';
import { WorkEntriesController } from '../controllers/workEntriesController.js';

const workEntrieRouter = express.Router();
const workEntriesController = new WorkEntriesController(); // יצירת מופע של WorkEntriesController

workEntrieRouter.get('/:employeeId', workEntriesController.getWorkEntriesByEmployee); // שליחה לפונקציה של המופע
workEntrieRouter.put('/:WorkEntrieId', workEntriesController.updateWorkEntrie); // שליחה לפונקציה של המופע
workEntrieRouter.post('/:employeeId', workEntriesController.createWorkEntry); // שליחה לפונקציה של המופע
// workEntriesRouter.get('/:employeeId', WorkEntriesController.getUniqueBooksByEmployee);
workEntrieRouter.get('/reports/editor/:employeeId', workEntriesController.getEditorWorkByMonth);
workEntrieRouter.get('/reports/project/:bookId', workEntriesController.getProjectWorkByMonth);
workEntrieRouter.get('/reports/editors-summary', workEntriesController.getEditorsSummaryByMonth);

workEntrieRouter.get('/reports/books-summary', workEntriesController.getBooksSummary);
workEntrieRouter.get('/reports/book/:bookId/employee/:employeeId', workEntriesController.getBookEmployeeDetails);
workEntrieRouter.get('/reports/book/:bookId', workEntriesController.getBookEmployeesSummary);


export default workEntrieRouter;

