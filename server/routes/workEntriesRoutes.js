import express from 'express';
import { WorkEntriesController } from '../controllers/workEntriesController.js';
import { verifyToken } from "../middleware/authenticateToken.js";

const workEntrieRouter = express.Router();
const workEntriesController = new WorkEntriesController();

workEntrieRouter.get('/:employeeId', verifyToken, workEntriesController.getWorkEntriesByEmployee);
workEntrieRouter.put('/:WorkEntrieId', verifyToken, workEntriesController.updateWorkEntrie);
workEntrieRouter.post('/:employeeId', verifyToken, workEntriesController.createWorkEntry);
workEntrieRouter.delete('/:employeeId', verifyToken, workEntriesController.deleteWorkEntry);

workEntrieRouter.get('/reports/editor/:employeeId', verifyToken, workEntriesController.getEditorWorkByMonth);
workEntrieRouter.get('/reports/project/:bookId', verifyToken, workEntriesController.getProjectWorkByMonth);
workEntrieRouter.get('/reports/editors-summary', verifyToken, workEntriesController.getEditorsSummaryByMonth);

workEntrieRouter.get('/reports/books-summary', verifyToken, workEntriesController.getBooksSummary);
workEntrieRouter.get('/reports/book/:bookId/employee/:employeeId', verifyToken, workEntriesController.getBookEmployeeDetails);
workEntrieRouter.get('/reports/book/:bookId', verifyToken, workEntriesController.getBookEmployeesSummary);


export default workEntrieRouter;

