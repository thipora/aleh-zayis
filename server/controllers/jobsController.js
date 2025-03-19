// import { JobsService } from '../services/jobsService.js';

// export class JobsController {
//     static jobsService = new JobsService();

//     async getJobsByEmployee(req, res, next) {
//         try {
//             const { employeeId } = req.params;
//             const { start, range, sort } = req.query;
//             const jobs = await JobsController.jobsService.getJobsByEmployee(employeeId, { start, range, sort });
//             return res.json(jobs);
//         } catch (ex) {
//             next({
//                 statusCode: ex.errno || 500,
//                 message: ex.message || ex
//             });
//         }
//     }
// }


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
}

