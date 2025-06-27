import express from 'express';
import { ReportsController } from '../controllers/reportsController.js';
import { verifyToken } from "../middleware/authenticateToken.js";

const reportsRouter = express.Router();
const reportsController = new ReportsController();

reportsRouter.get('/monthly-summary/employees', verifyToken, reportsController.getMonthlySummaryByEmployees);
reportsRouter.get("/monthly-summary/employee/:employeeId", verifyToken, reportsController.getMonthlySummaryByEmployee);
reportsRouter.get('/book-summary/:bookId', verifyToken, reportsController.getBookSummary);
reportsRouter.get('/books-summary', verifyToken, reportsController.getMonthlyBooksSummary);
reportsRouter.get('/all-work-entries-excel', verifyToken, reportsController.exportAllWorkEntries);

export default reportsRouter;