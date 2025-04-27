import { SummaryService } from '../services/SummaryService.js';

export class SummaryController {
    static summaryService = new SummaryService();

    // סיכום שעות לפי חודש - מחזיר כמה שעות עבד העובד בכל ספר בחודש מסוים
    async getSummaryByMonth(req, res, next) {
        try {
            const { employeeId } = req.params;
            const { month } = req.query; // month בפורמט YYYY-MM
            const summary = await SummaryController.summaryService.getSummaryByMonth(employeeId, month);
            res.json(summary);
        } catch (ex) {
            next({ statusCode: ex.errno || 500, message: ex.message || ex });
        }
    }

    // סיכום שעות לפי ספר - מחזיר כמה שעות עבד העובד בכל חודש בספר מסוים
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

    // אפשר להוסיף כאן בעתיד סיכומים חודשיים/שנתיים/משולבים בקלות
}
