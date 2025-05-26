import express from 'express';
import { BookAssignmentsController } from '../controllers/bookAssignmentsController.js';
import { verifyToken } from "../middleware/authenticateToken.js";

const BookAssignmentsRouter = express.Router();
const bookAssignmentsController = new BookAssignmentsController();

BookAssignmentsRouter.post('/', verifyToken, bookAssignmentsController.assignEditor);
BookAssignmentsRouter.post('/complete', verifyToken, bookAssignmentsController.markBookCompleted);
BookAssignmentsRouter.post('/by-employee/:employeeId', verifyToken, bookAssignmentsController.getBooksByEmployee);
BookAssignmentsRouter.put("/custom-rate", verifyToken, bookAssignmentsController.updateCustomRate);

export default BookAssignmentsRouter;

