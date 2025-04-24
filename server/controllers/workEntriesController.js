

import { WorkEntriesService } from '../services/workEntriesService.js';

export class WorkEntriesController {
    static workEntriesService = new WorkEntriesService();

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
            const { quantity, description, notes } = req.body; // פרטי העבודה החדשה

            const updatedWorkEntrie = await WorkEntriesController.workEntriesService.updateWorkEntrie(WorkEntrieId, {
                quantity, description, notes
            });

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


    async createWorkEntry(req, res, next) {
        try {
            const { employeeId } = req.params;
            const { date, quantity, description, notes, book_id, book_name } = req.body;

            const newEntry = await WorkEntriesController.workEntriesService.createWorkEntry(employeeId, {
                date, quantity, description, notes, book_id, book_name });

            res.status(201).json(newEntry);
        } catch (ex) {
            next({
                statusCode: ex.errno || 500,
                message: ex.message || ex
            });
        }
    }
}

