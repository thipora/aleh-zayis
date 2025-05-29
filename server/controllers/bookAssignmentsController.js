import { BookAssignmentsService } from '../services/bookAssignmentsService.js';

export class BookAssignmentsController {
  static bookAssignmentsService = new BookAssignmentsService();

  async assignEditor(req, res, next) {
    const { employeeId, bookClickUpId, selectedRoleIds } = req.body;
    try {
      const result = await BookAssignmentsController.bookAssignmentsService.assignEmployeeToBookByAZId(
        employeeId,
        bookClickUpId,
        selectedRoleIds
      );
      res.status(200).json(result);
    } catch (error) {
      next({
        statusCode: err.errno || 500,
        message: err.message || err
      });
    }
  }

  async markBookCompleted(req, res) {
    const { bookId, employeeId } = req.body;

    try {
      await BookAssignmentsController.bookAssignmentsService.markBookAsCompleted(employeeId, bookId);
      res.status(200).json({ message: 'Book marked as completed' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to mark book as completed' });
    }
  }

  async getBooksByEmployee(req, res) {
    const { employeeId } = req.params;
    try {
      const books = await BookAssignmentsController.bookAssignmentsService.getBooksForEmployee(employeeId);
      res.json(books);
    } catch (error) {
      console.error("Error getting books for employee", error);
      res.status(500).json({ error: "Failed to fetch books" });
    }
  }

  async updateCustomRate(req, res) {
    const { id_book_assignment, custom_rate } = req.body;

    if (!id_book_assignment || !custom_rate) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    try {
      await BookAssignmentsController.bookAssignmentsService.updateCustomRate(id_book_assignment, custom_rate);
      res.json({ success: true });
    } catch (error) {
      console.error("Error updating custom rate:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

}
