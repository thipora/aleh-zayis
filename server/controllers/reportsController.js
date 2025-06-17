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
      const { month, year } = req.query;

      if (!bookId) return res.status(400).json({ message: "Missing bookId" });

      let data;
      if (!month || !year) {
        data = await ReportsController.reportsService.getBookSummary(bookId)
      }
      else {
        data = await ReportsController.reportsService.getBookSummary(bookId, Number(month), Number(year));
      }
      res.json(data);
    } catch (ex) {
      next({ statusCode: ex.errno || 500, message: ex.message || ex });
    }
  }

  async getMonthlyBooksSummary(req, res) {
    const { month = null, year = null } = req.query;
    try {
      let data;
      if (month && year) {
        data = await ReportsController.reportsService.getMonthlyBooksSummary(month, year);
      } else {
        data = await ReportsController.reportsService.getAllBooksSummary();
      }
      res.json(data);
    } catch (err) {
      console.error("Error in getMonthlyBooksSummary:", err);
      res.status(500).json({ error: "Failed to fetch books summary" });
    }
  }

}
