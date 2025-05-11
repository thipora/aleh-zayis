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

}
