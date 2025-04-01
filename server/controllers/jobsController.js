

import { JobsService } from '../services/jobsService.js';

export class JobsController {
    static jobsService = new JobsService();

    async getJobsByUser(req, res, next) {
        try {
            const { userId } = req.params; // 🔹 שימוש ב-userId
            const { start = 0, range = 10, sort = "date DESC", bookId, fromDate, toDate } = req.query;

            const jobs = await JobsController.jobsService.getJobsByUser(userId, { start, range, sort, bookId, fromDate, toDate });
            return res.json(jobs);
        } catch (ex) {
            next({
                statusCode: ex.errno || 500,
                message: ex.message || ex
            });
        }
    }


    async updateJob(req, res, next) {
        try {
            const { jobId } = req.params; // מזהה העבודה לעדכון
            const { date, workQuantity, bookId, description, notes, paymentTypeId, isSpecialWork } = req.body; // פרטי העבודה החדשה

            // קריאה לפונקציה לשירות לעדכון העבודה
            const updatedJob = await JobsController.jobsService.updateJob(jobId, {
                date, workQuantity, bookId, description, notes, paymentTypeId, isSpecialWork
            });

            // אם העבודה עודכנה בהצלחה, נחזיר תשובה
            if (updatedJob.affectedRows > 0) {
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


    async createJob(req, res, next) {
        try {
            const { userId } = req.params; // מזהה המשתמש
            const { date, quantity, book_id, description, notes, isSpecialWork } = req.body; // פרטי העבודה

            // קריאה לשירות להוספת העבודה
            const newJob = await JobsController.jobsService.createJob(userId, {
                date, quantity, book_id, description, notes, isSpecialWork
            });

            return res.status(201).json(newJob); // עבודה הוספה בהצלחה
        } catch (ex) {
            next({
                statusCode: ex.errno || 500,
                message: ex.message || ex
            });
        }
    }

}

