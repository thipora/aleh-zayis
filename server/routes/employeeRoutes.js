import express from 'express';
import { EmployeeController } from '../controllers/employeeController.js';
import { verifyToken } from "../middleware/authenticateToken.js";

const employeeRouter = express.Router();
const employeeController = new EmployeeController();

employeeRouter.post('/', verifyToken, employeeController.createEmployee);
employeeRouter.get('/', verifyToken, employeeController.getAllEmployees);
employeeRouter.put('/:employeeId/availability', verifyToken, employeeController.putStatusAvailability);
employeeRouter.get('/:employeeId/currency', verifyToken, employeeController.getEmployeeCurrency);
employeeRouter.put('/:employeeId/currency', verifyToken, employeeController.putCurrency);

export default employeeRouter;


