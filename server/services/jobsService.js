// import executeQuery from '../config/db.js';
// import { GeneryQuery } from '../queries/generyQueries.js';

// export class JobsService {
//     static table = "jobs";

//     async getJobsByEmployee(employeeId, { start = 0, range = 10, sort = "created_at DESC" } = {}) {
//         const columns = "id_job, title, description, status, created_at";
//         const conditions = ["employee_id"];
//         const query = GeneryQuery.getQuery(JobsService.table, columns, conditions);
//         const advancedQuery = GeneryQuery.getAdvancedQuery({ start, range, sort });
//         const finalQuery = query + advancedQuery;

//         return await executeQuery(finalQuery, [employeeId]);
//     }
// }


import executeQuery from '../config/db.js';
import { GeneryQuery } from '../queries/generyQueries.js';

export class JobsService {
    static table = "work_logs";

    async getJobsByUser(userId, { start = 0, range = 10, sort = "date DESC", bookId, fromDate, toDate } = {}) {
        // שליפת ה-employee_id לפי ה-userId
        const employeeQuery = "SELECT id_employee FROM employees WHERE user_id = ?";
        const employees = await executeQuery(employeeQuery, [userId]);

        if (!employees.length) return [];

        const employeeId = employees[0].id_employee;

        // שליפת העבודות של העובד
        let conditions = ["employee_id = ?"];
        let values = [employeeId];

        if (bookId) {
            conditions.push("book_id = ?");
            values.push(bookId);
        }

        if (fromDate) {
            conditions.push("date >= ?");
            values.push(fromDate);
        }

        if (toDate) {
            conditions.push("date <= ?");
            values.push(toDate);
        }


        let query = `
        SELECT 
            w.book_id, 
            w.date, 
            w.work_quantity, 
            w.notes, 
            p.type AS payment_type
        FROM alehzayis.work_logs w
        JOIN alehzayis.payment_types p ON w.payment_type_id = p.id_payment_types
        WHERE ${conditions.join(" AND ")}
        `;

        if (sort) {
            query += ` ORDER BY ${sort}`;
        }




    
        // const columns = "book_id, date, work_quantity, notes, payment_type_id";
        // const query = GeneryQuery.getQuery(JobsService.table, columns, conditions);
        // const advancedQuery = GeneryQuery.getAdvancedQuery({ start, range, sort });
        // const finalQuery = query + advancedQuery;

        // return await executeQuery(finalQuery, values);
        return await executeQuery(query, values);

    }
}
