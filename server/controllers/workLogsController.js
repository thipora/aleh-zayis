

import { WorkLogsService } from '../services/workLogsService.js';

export class WorkLogsController {
    static workLogsService = new WorkLogsService();

    async getWorkLogsByUser(req, res, next) {
        try {
            const { userId } = req.params; // 🔹 שימוש ב-userId
            const { start = 0, range = 10, sort = "date DESC", bookId, fromDate, toDate } = req.query;

            const jobs = await WorkLogsController.workLogsService.getWorkLogsByUser(userId, { start, range, sort, bookId, fromDate, toDate });
            return res.json(jobs);
        } catch (ex) {
            next({
                statusCode: ex.errno || 500,
                message: ex.message || ex
            });
        }
    }


    async updateWorkLog(req, res, next) {
        try {
            const { WorkLogId } = req.params; // מזהה העבודה לעדכון
            const { date, workQuantity, bookId, description, notes, paymentTypeId, isSpecialWork } = req.body; // פרטי העבודה החדשה

            // קריאה לפונקציה לשירות לעדכון העבודה
            const updatedWorkLog = await WorkLogsController.workLogsService.updateWorkLog(WorkLogId, {
                date, workQuantity, bookId, description, notes, paymentTypeId, isSpecialWork
            });

            // אם העבודה עודכנה בהצלחה, נחזיר תשובה
            if (updatedWorkLog.affectedRows > 0) {
                return res.status(200).json({ message: "Work log updated successfully" });
            } else {
                return res.status(404).json({ message: "Work log not found" });
            }
        } catch (ex) {
            next({
                statusCode: ex.errno || 500,
                message: ex.message || ex
            });
        }
    }


    async createWorkLog(req, res, next) {
        try {
            const { userId } = req.params; // מזהה המשתמש
            const { date, quantity, book_id, description, notes, specialWork = 0 } = req.body; // פרטי העבודה

            // קריאה לשירות להוספת העבודה
            const newWorkLog = await WorkLogsController.workLogsService.createWorkLog(userId, {
                date, quantity, book_id, description, notes, specialWork
            });

            return res.status(201).json(newWorkLog); // עבודה הוספה בהצלחה
        } catch (ex) {
            next({
                statusCode: ex.errno || 500,
                message: ex.message || ex
            });
        }
    }

}

