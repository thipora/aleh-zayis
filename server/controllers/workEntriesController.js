

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
            const { WorkEntrieId } = req.params;
            const { start_time, end_time, description, notes = null } = req.body;

            const updatedWorkEntrie = await WorkEntriesController.workEntriesService.updateWorkEntrie(WorkEntrieId, {
                start_time, end_time, description, notes
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
            const { roleId, date, quantity, description, notes, book_id, book_name, start_time, end_time } = req.body;

            const newEntry = await WorkEntriesController.workEntriesService.createWorkEntry(employeeId, {
                roleId, date, quantity, description, notes, book_id, book_name, start_time, end_time });

            res.status(201).json(newEntry);
        } catch (ex) {
            next({
                statusCode: ex.errno || 500,
                message: ex.message || ex
            });
        }
    }

    async getEditorWorkByMonth(req, res, next) {
        try {
            const { employeeId } = req.params;
            const { month, year } = req.query;

            if (!employeeId || !month || !year) {
                return res.status(400).json({ message: 'Missing required parameters' });
            }

            const data = await WorkEntriesController.workEntriesService.getEditorWorkByMonth(
                employeeId, { month, year }
            );
            res.json(data);
        } catch (ex) {
            next({
                statusCode: ex.errno || 500,
                message: ex.message || ex
            });
        }
    }

    async getProjectWorkByMonth(req, res, next) {
        try {
            const { bookId } = req.params;
            const { month, year } = req.query;

            if (!bookId || !month || !year) {
                return res.status(400).json({ message: 'Missing required parameters' });
            }

            const data = await WorkEntriesController.workEntriesService.getProjectWorkByMonth(
                bookId, { month, year }
            );
            res.json(data);
        } catch (ex) {
            next({
                statusCode: ex.errno || 500,
                message: ex.message || ex
            });
        }
    }

    async getEditorsSummaryByMonth(req, res, next) {
        try {
            const { month, year } = req.query;

            if (!month || !year) {
                return res.status(400).json({ message: 'Missing required parameters' });
            }

            const data = await WorkEntriesController.workEntriesService.getEditorsSummaryByMonth(
                { month, year }
            );
            res.json(data);
        } catch (ex) {
            next({
                statusCode: ex.errno || 500,
                message: ex.message || ex
            });
        }
    }

        async getBooksSummary(req, res, next) {
            try {
                const { month, year } = req.query;
                const data = await WorkEntriesController.workEntriesService.getBooksSummary({ month, year });
                res.json(data);
            } catch (ex) {
                next({ statusCode: ex.errno || 500, message: ex.message || ex });
            }
        }
    
        async getBookEmployeesSummary(req, res, next) {
            try {
                const { bookId } = req.params;
                const { month, year } = req.query;
                const data = await WorkEntriesController.workEntriesService.getBookEmployeesSummary(bookId, { month, year });
                res.json(data);
            } catch (ex) {
                next({ statusCode: ex.errno || 500, message: ex.message || ex });
            }
        }
    
        async getBookEmployeeDetails(req, res, next) {
            try {
                const { bookId, employeeId } = req.params;
                const { month, year } = req.query;
                const data = await WorkEntriesController.workEntriesService.getBookEmployeeDetails(bookId, employeeId, { month, year });
                res.json(data);
            } catch (ex) {
                next({ statusCode: ex.errno || 500, message: ex.message || ex });
            }
        }

        async getMonthlyWorkSummaryByEmployees(req, res, next) {
            try {
              const { month, year } = req.query;
              if (!month || !year) {
                return res.status(400).json({ message: "Missing month or year" });
              }
              const data = await WorkEntriesController.workEntriesService.getPaymentsSummaryByMonth({ month, year });
              res.json(data);
            } catch (ex) {
              next({ statusCode: ex.errno || 500, message: ex.message || ex });
            }
          }
          
    
}

