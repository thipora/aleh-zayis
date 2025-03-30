// const express = require('express');
// const router = express.Router();
// const employeeController = require('../controllers/employeeController');
// const { verifyManager } = require('../middlewares/authMiddleware');

// // Route to get all employees (only accessible by manager)
// router.get('/employees', verifyManager, employeeController.getAllEmployees);

// // Route to add a new employee (only accessible by manager)
// router.post('/employees', verifyManager, employeeController.addEmployee);

// module.exports = router;
import express from 'express';
import { EmployeeController } from '../controllers/employeeController.js';

const employeeRouter = express.Router();
const employeeController = new EmployeeController();

// יצירת עובד חדש
employeeRouter.post('/', employeeController.createEmployee);
employeeRouter.get('/', employeeController.getAllEmployees); // ניווט לקריאה לפונקציה שמחזירה את כל העובדים


export default employeeRouter;


