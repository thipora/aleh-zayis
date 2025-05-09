// import express from 'express';
// import { addAssignment } from '../controllers/bookAssignmentsController.js';

// const router = express.Router();

// router.post('/', addAssignment);

// export default router;

import express from 'express';
import { BookAssignmentsController } from '../controllers/bookAssignmentsController.js';

const router = express.Router();

// router.post('/', BookAssignmentsController.addAssignment);
router.post('/', BookAssignmentsController.assignEditor);


export default router;
