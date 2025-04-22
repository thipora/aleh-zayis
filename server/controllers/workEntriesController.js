

import { WorkEntriesService } from '../services/workEntriesService.js';

export class WorkEntriesController {
    static workEntriesService = new WorkEntriesService();

    async getWorkEntriesByUser(req, res, next) {
        try {
            const { userId } = req.params; // 🔹 שימוש ב-userId
            const { start = 0, range = 10, sort = "date DESC", bookId, fromDate, toDate } = req.query;

            const jobs = await WorkEntriesController.workEntriesService.getWorkEntriesByUser(userId, { start, range, sort, bookId, fromDate, toDate });
            return res.json(jobs);
        } catch (ex) {
            next({
                statusCode: ex.errno || 500,
                message: ex.message || ex
            });
        }
    }


    async getWorkEntriesByEmployee(req, res, next) {
        try {
            const { employeeId } = req.params;
            const { month, year, projectId, sort, start, range } = req.query;

            const entries = await WorkEntriesController.workEntriesService.getWorkEntriesByEmployee(
                employeeId,
                { month, year, projectId, sort, start: +start || 0, range: +range || 10 }
            );

            res.json(entries);
        } catch (ex) {
            next({ statusCode: ex.errno || 500, message: ex.message || ex });
        }
    }



    async updateWorkEntrie(req, res, next) {
        try {
            const { WorkEntrieId } = req.params; // מזהה העבודה לעדכון
            const { work_quantity, description, notes, isSpecialWork } = req.body; // פרטי העבודה החדשה

            // קריאה לפונקציה לשירות לעדכון העבודה
            const updatedWorkEntrie = await WorkEntriesController.workEntriesService.updateWorkEntrie(WorkEntrieId, {
                work_quantity, description, notes, isSpecialWork
            });

            // אם העבודה עודכנה בהצלחה, נחזיר תשובה
            if (updatedWorkEntrie.affectedRows > 0) {
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


    // async createWorkEntrie(req, res, next) {
    //     try {
    //         const { userId } = req.params; // מזהה המשתמש
    //         const { date, quantity, book_id, description, notes, specialWork = 0 } = req.body; // פרטי העבודה

    //         // קריאה לשירות להוספת העבודה
    //         const newWorkEntrie = await WorkEntriesController.workEntriesService.createWorkEntrie(userId, {
    //             date, quantity, book_id, description, notes, specialWork
    //         });

    //         return res.status(201).json(newWorkEntrie); // עבודה הוספה בהצלחה
    //     } catch (ex) {
    //         next({
    //             statusCode: ex.errno || 500,
    //             message: ex.message || ex
    //         });
    //     }
    // }


    async createWorkEntry(req, res, next) {
        try {
            const { employeeId } = req.params;
            const { date, quantity, rate_type, description_work, notes, project_name, clickup_project_id } = req.body;

            const newEntry = await WorkEntriesController.workEntriesService.createWorkEntry(employeeId, {
                date, quantity, rate_type, description_work, notes, project_name, clickup_project_id });

            res.status(201).json(newEntry);
        } catch (ex) {
            next({
                statusCode: ex.errno || 500,
                message: ex.message || ex
            });
        }
    }
}

