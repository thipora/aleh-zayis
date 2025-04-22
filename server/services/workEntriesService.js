
import { executeQuery } from '../config/db.js';

export class WorkEntriesService {
    static table = "work_entries";

//     async getWorkEntriesByUser(userId, { start = 0, range = 10, sort = "date DESC", bookId, fromDate, toDate } = {}) {
//         // שליפת ה-employee_id לפי ה-userId
//         const employeeQuery = "SELECT id_employee FROM employees WHERE user_id = ?";
//         const employees = await executeQuery(employeeQuery, [userId]);

//         if (!employees.length) return [];

//         const employeeId = employees[0].id_employee;

//         // שליפת העבודות של העובד
//         let conditions = ["employee_id = ?"];
//         let values = [employeeId];

//         if (bookId) {
//             conditions.push("book_id = ?");
//             values.push(bookId);
//         }

//         if (fromDate) {
//             conditions.push("date >= ?");
//             values.push(fromDate);
//         }

//         if (toDate) {
//             conditions.push("date <= ?");
//             values.push(toDate);
//         }

//         let query = `
//   SELECT 
//     b.title, 
//     w.id_work_logs, 
//     w.date, 
//     w.work_quantity, 
//     w.description, 
//     w.notes,
//     w.is_special_work,
//     CASE 
//       WHEN w.is_special_work = TRUE THEN r.special_payment_type
//       ELSE r.payment_type
//     END AS payment_type
//   FROM alehzayis.work_logs w
//   JOIN alehzayis.books b ON w.book_id = b.id_book
//   JOIN alehzayis.employees e ON w.employee_id = e.id_employee
//   JOIN alehzayis.roles r ON e.role_id = r.id_role
//   WHERE ${conditions.join(" AND ")}
// `;


//         if (sort) {
//             query += ` ORDER BY ${sort}`;
//         }
//         return await executeQuery(query, values);

//     }


async getWorkEntriesByEmployee(employeeId, { month, year, projectId, sort = 'date DESC', start = 0, range = 10 } = {}) {
    const conditions = ['employee_id = ?'];
    const values = [employeeId];

    if (month && year) {
        // נחשב את התחלה וסוף של החודש
        const fromDate = `${year}-${String(month).padStart(2, '0')}-01`;
        const toDate = `${year}-${String(month).padStart(2, '0')}-31`; // תמיד יספיק, MySQL כבר ידע לעצור לפי החודש

        conditions.push('date >= ?');
        values.push(fromDate);

        conditions.push('date <= ?');
        values.push(toDate);
    }

    if (projectId) {
        conditions.push('clickup_project_id = ?');
        values.push(projectId);
    }

    let query = `
        SELECT 
            id_work_entries,
            date,
            quantity,
            description_work,
            notes,
            rate_type,
            project_name,
            clickup_project_id
        FROM work_entries
        WHERE ${conditions.join(' AND ')}
        ORDER BY ${sort}
        LIMIT ? OFFSET ?
    `;

    values.push(range, start);

    return await executeQuery(query, values);
}




    async updateWorkEntrie(workEntrieId, { date, workQuantity, bookId, description, notes, paymentTypeId }) {
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
            UPDATE ${WorkEntriesService.table}
            SET ${updateFields.join(", ")}
            WHERE id_work_logs = ?
        `;

        values.push(workEntrieId); // הוספת מזהה העבודה לשאילתה

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



    // async createWorkEntrie(userId, { date, quantity, book_id, description, notes, specialWork }) {
    //     const employeeQuery = "SELECT id_employee FROM employees WHERE user_id = ?";
    //     const employees = await executeQuery(employeeQuery, [userId]);

    //     if (!employees.length) throw new Error("Employee not found");

    //     const employeeId = employees[0].id_employee;

    //     const query = `
    //             INSERT INTO ${WorkEntriesService.table} (employee_id, date, work_quantity, book_id, description, notes, is_special_work)
    //             VALUES (?, ?, ?, ?, ?, ?, ?)`;

    //     const values = [employeeId, date, quantity, book_id, description, notes, specialWork];

    //     const result = await executeQuery(query, values);
    //     return { id_work_logs: result.insertId, ...values }; // מחזיר את פרטי העבודה החדשה
    // }





    async createWorkEntry(employeeId, { date, quantity, rate_type, description_work, notes, project_name, clickup_project_id }) 
        {
        const query = `
            INSERT INTO ${WorkEntriesService.table}
            (employee_id, date, quantity, rate_type, description_work, notes, project_name, clickup_project_id)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const values = [employeeId, date, quantity, rate_type, description_work, notes, project_name, clickup_project_id];

        const result = await executeQuery(query, values);
        return {
            id_work_entries: result.insertId, employeeId, date, quantity, rate_type, description_work, notes, project_name, clickup_project_id };
    }
}
