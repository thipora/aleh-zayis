// controllers/reportsController.js
import { WorkEntriesService } from "../services/workEntriesService.js";
import { ReportsService } from "../services/reportsService.js";

export class ReportsController {
  static workEntriesService = new WorkEntriesService();
  static reportsService = new ReportsService();

  async getMonthlySummaryByEmployees(req, res, next) {
    try {
      const { month, year } = req.query;
      if (!month || !year) {
        return res.status(400).json({ message: 'Missing month or year' });
      }

      const data = await ReportsController.workEntriesService.getMonthlyWorkSummaryByEmployees({ month, year });
      res.json(data);
    } catch (ex) {
      next({ statusCode: 500, message: ex.message || ex });
    }
  }


  async getMonthlySummaryByEmployee(req, res, next) {
    try {
      const { employeeId } = req.params;
      const { month, year } = req.query;
  
      if (!employeeId || !month || !year) {
        return res.status(400).json({ message: "Missing required parameters" });
      }
  
      const data = await ReportsController.workEntriesService.getMonthlySummaryByEmployee(
        employeeId,
        { month, year }
      );
      res.json(data);
    } catch (ex) {
      next({
        statusCode: ex.errno || 500,
        message: ex.message || ex,
      });
    }
  }

  async getBookSummary(req, res, next) {
    try {
      const { bookId } = req.params;
      if (!bookId) return res.status(400).json({ message: "Missing bookId" });

      const data = await ReportsController.reportsService.getBookSummary(bookId);
      res.json(data);
    } catch (ex) {
      next({ statusCode: ex.errno || 500, message: ex.message || ex });
    }
  }

  
}
