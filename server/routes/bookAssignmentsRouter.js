// import express from 'express';
// import { addAssignment } from '../controllers/bookAssignmentsController.js';

// const router = express.Router();

// router.post('/', addAssignment);

// export default router;

import express from 'express';
import { BookAssignmentsController } from '../controllers/bookAssignmentsController.js';

const BookAssignmentsRouter = express.Router();
const bookAssignmentsController = new BookAssignmentsController();

// router.post('/', BookAssignmentsController.addAssignment);
BookAssignmentsRouter.post('/', bookAssignmentsController.assignEditor);
BookAssignmentsRouter.post('/complete', bookAssignmentsController.markBookCompleted);
BookAssignmentsRouter.post('/by-employee/:employeeId', bookAssignmentsController.getBooksByEmployee);
BookAssignmentsRouter.put("/custom-rate", bookAssignmentsController.updateCustomRate);

export default BookAssignmentsRouter;

