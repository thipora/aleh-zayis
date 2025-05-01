// routes/reportsRouter.js
import express from 'express';
import { ReportsController } from '../controllers/reportsController.js';

const reportsRouter = express.Router();
const reportsController = new ReportsController();

reportsRouter.get('/monthly-summary/employees', reportsController.getMonthlySummaryByEmployees);
reportsRouter.get("/monthly-summary/employee/:employeeId", reportsController.getMonthlySummaryByEmployee);
reportsRouter.get('/book-summary/:bookId', reportsController.getBookSummary);


export default reportsRouter;