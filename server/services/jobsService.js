
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
        SELECT b.title, w.id_work_logs, w.date, w.work_quantity, w.description, w.notes AS payment_type FROM alehzayis.work_logs w JOIN alehzayis.books b ON w.book_id = b.id_book WHERE ${conditions.join(" AND ")}`;

        if (sort) {
            query += ` ORDER BY ${sort}`;
        }
        return await executeQuery(query, values);

    }



    async updateJob(jobId, { date, workQuantity, bookId, description, notes, paymentTypeId }) {
        const updateFields = [];
        const values = [];

        if (date) {
            updateFields.push("date = ?");
            values.push(date);
        }

        if (workQuantity) {
            updateFields.push("work_quantity = ?");
            values.push(workQuantity);
        }

        if (bookId) {
            updateFields.push("book_id = ?");
            values.push(bookId);
        }

        if (description) {
            updateFields.push("description = ?");
            values.push(description);
        }

        if (notes) {
            updateFields.push("notes = ?");
            values.push(notes);
        }

        if (paymentTypeId) {
            updateFields.push("payment_type_id = ?");
            values.push(paymentTypeId);
        }

        // מבנה השאילתה לעדכון
        const query = `
            UPDATE ${JobsService.table}
            SET ${updateFields.join(", ")}
            WHERE id_work_logs = ?
        `;
        
        values.push(jobId); // הוספת מזהה העבודה לשאילתה

        return await executeQuery(query, values);
    }


    // async createJob({ date, quantity, description, notes }) {
    //     // date, quantity, book_id, description, notes
    //     const query = `
    //         INSERT INTO ${JobService.table} (book_id, date, quantity, description, notes)
    //         VALUES (?, ?, ?, ?, ?)`;
    //     const values = [book_id, date, quantity, description, notes];

    //     const result = await executeQuery(query, values);
    //     return { id_job: result.insertId, ...values };
    // }



        async createJob(userId, { date, quantity, book_id, description, notes }) {
            const employeeQuery = "SELECT id_employee FROM employees WHERE user_id = ?";
            const employees = await executeQuery(employeeQuery, [userId]);
    
            if (!employees.length) throw new Error("Employee not found");
    
            const employeeId = employees[0].id_employee;
    
            const query = `
                INSERT INTO ${JobsService.table} (employee_id, date, work_quantity, book_id, description, notes)
                VALUES (?, ?, ?, ?, ?, ?)`;
    
            const values = [employeeId, date, quantity, book_id, description, notes];
    
            const result = await executeQuery(query, values);
            return { id_work_logs: result.insertId, ...values }; // מחזיר את פרטי העבודה החדשה
        }
    


}
