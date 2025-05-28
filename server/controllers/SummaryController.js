import { SummaryService } from '../services/SummaryService.js';

export class SummaryController {
    static summaryService = new SummaryService();

    async getSummaryByMonth(req, res, next) {
        try {
            const { employeeId } = req.params;
            const { month } = req.query;
            const summary = await SummaryController.summaryService.getSummaryByMonth(employeeId, month);
            res.json(summary);
        } catch (ex) {
            next({ statusCode: ex.errno || 500, message: ex.message || ex });
        }
    }

    async getSummaryByBook(req, res, next) {
        try {
            const { employeeId } = req.params;
            const { bookId } = req.query;
            const summary = await SummaryController.summaryService.getSummaryByBook(employeeId, bookId);
            res.json(summary);
        } catch (ex) {
            next({ statusCode: ex.errno || 500, message: ex.message || ex });
        }
    }
}
