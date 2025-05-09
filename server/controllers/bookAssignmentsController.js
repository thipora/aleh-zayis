// import { addAssignmentA } from '../services/bookAssignmentsService.js';

// export const addAssignment = async (req, res) => {
//   const { bookId, workerId } = req.body;

//   if (!bookId || !workerId) {
//     return res.status(400).json({ message: 'Missing required fields' });
//   }

//   try {
//     await addAssignmentA(bookId, workerId);
//     res.status(201).json({ message: 'Book assignment added successfully' });
//   } catch (err) {
//     console.error('Error adding book assignment:', err.message);
//     res.status(500).json({ message: err.message || 'Internal server error' });
//   }
// };


import { BookAssignmentsService } from '../services/bookAssignmentsService.js';

export class BookAssignmentsController {
  static bookAssignmentsService = new BookAssignmentsService();

  static async assignEditor(req, res, next) {
  const { employeeId, bookClickUpId } = req.body;

  try {
    const result = await BookAssignmentsController.bookAssignmentsService.assignEmployeeToBookByAZId(
      employeeId,
      bookClickUpId
    );
    res.status(result.inserted ? 201 : 200).json(result);
  } catch (err) {
    next({
      statusCode: err.errno || 500,
      message: err.message || err
    });
  }
}

}
