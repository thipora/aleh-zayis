import { BookAssignmentsService } from '../services/bookAssignmentsService.js';

export class BookAssignmentsController {
  static bookAssignmentsService = new BookAssignmentsService();

  static async assignEditor(req, res, next) {
  const { employeeId, bookClickUpId, selectedRoleIds } = req.body;
  try {
    const result = await BookAssignmentsController.bookAssignmentsService.assignEmployeeToBookByAZId(
      employeeId,
      bookClickUpId,
      selectedRoleIds
    );
    res.status(result.inserted ? 201 : 200).json(result);
  } catch (err) {
    next({
      statusCode: err.errno || 500,
      message: err.message || err
    });
  }
}

static async markBookCompleted(req, res) {
  const { bookId, employeeId } = req.body;

  try {
    await BookAssignmentsController.bookAssignmentsService.markBookAsCompleted(employeeId, bookId);
    res.status(200).json({ message: 'Book marked as completed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to mark book as completed' });
  }
}

static async getBooksByEmployee(req, res) {
  const { employeeId } = req.params;
  try {
    const books = await bookAssignmentsService.getBooksForEmployee(employeeId);
    res.json(books);
  } catch (err) {
    console.error("Error getting books for employee", err);
    res.status(500).json({ error: "Failed to fetch books" });
  }
}



}
