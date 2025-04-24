import express from 'express';
import { EmployeeController } from '../controllers/employeeController.js';

const employeeRouter = express.Router();
const employeeController = new EmployeeController();

employeeRouter.post('/', employeeController.createEmployee);
employeeRouter.get('/', employeeController.getAllEmployees);

export default employeeRouter;


