
import { executeQuery } from '../config/db.js';

export class WorkEntriesService {
    static table = "work_entries";

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
            conditions.push('book_id = ?');
            values.push(projectId);
        }


        let query = `
            SELECT 
                id_work_entries,
                date,
                quantity,
                description,
                notes,
                book_id,
                book_name,
                start_time,
                end_time
            FROM work_entries
            WHERE ${conditions.join(' AND ')}
            ORDER BY ${sort}
        `;

        return await executeQuery(query, values);
    }

    async updateWorkEntrie(workEntrieId, { date, quantity, description, notes }) {
        const updateFields = [];
        const values = [];

        if (date) {
            updateFields.push("date = ?");
            values.push(date);
        }

        if (quantity) {
            updateFields.push("quantity = ?");
            values.push(quantity);
        }

        if (description) {
            updateFields.push("description = ?");
            values.push(description);
        }

        if (notes) {
            updateFields.push("notes = ?");
            values.push(notes);
        }

        const query = `
            UPDATE ${WorkEntriesService.table}
            SET ${updateFields.join(", ")}
            WHERE id_work_entries = ?
        `;

        values.push(workEntrieId);

        return await executeQuery(query, values);
    }

    async createWorkEntry(employeeId, { date, quantity, description, notes, book_id, book_name, start_time, end_time }) 
        {
        const query = `
            INSERT INTO ${WorkEntriesService.table}
            (employee_id, date, quantity, description, notes, book_id, book_name, start_time, end_time)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const values = [employeeId, date, quantity, description, notes, book_id, book_name, start_time, end_time];

        const result = await executeQuery(query, values);
        return {
            id_work_entries: result.insertId, employeeId, date, quantity, description, notes, book_id, book_name, start_time, end_time };
    }


        // דוח 1: כל העבודה שעשה עורך מסוים בחודש מסוים (לפי פרויקטים)
        // async getEditorWorkByMonth(employeeId, { month, year }) {
        //     const sql = `
        //         SELECT we.book_id, we.book_name, we.date, we.quantity, we.description, we.notes, we.start_time, we.end_time, we.book_id
        //         FROM work_entries we
        //         WHERE we.employee_id = ?
        //           AND YEAR(we.date) = ?
        //           AND MONTH(we.date) = ?
        //         ORDER BY we.book_name, we.date
        //     `;
        //     return await executeQuery(sql, [employeeId, year, month]);
        // }
        

        async getEditorWorkByMonth(employeeId, { month, year }) {
            const sql = `
                SELECT
                    we.book_id,
                    we.book_name,
                    we.date,
                    we.quantity,
                    we.description,
                    we.notes,
                    we.start_time,
                    we.end_time,
                    we.book_id
                FROM work_entries we
                WHERE we.employee_id = ?
                  AND YEAR(we.date) = ?
                  AND MONTH(we.date) = ?
                ORDER BY we.book_id, we.date
            `;
            return await executeQuery(sql, [employeeId, year, month]);
        }
        
        
    // דוח 2: כל העבודה בפרויקט מסוים בחודש מסוים (לפי עורכים)
    async getProjectWorkByMonth(bookId, { month, year }) {
        const sql = `
            SELECT 
                u.name AS editor_name,
                we.date,
                we.quantity,
                we.description,
                we.notes,
                we.start_time,
                we.end_time
            FROM work_entries we
            JOIN employees e ON we.employee_id = e.id_employee
            JOIN users u ON e.user_id = u.id_user
            WHERE we.book_id = ?
              AND YEAR(we.date) = ?
              AND MONTH(we.date) = ?
            ORDER BY editor_name, we.date
        `;
        return await executeQuery(sql, [bookId, year, month]);
    }
    
    // דוח 3: סיכום עריכה לכל העורכים באותו החודש (סה"כ שעות לפי עורך)
    async getEditorsSummaryByMonth({ month, year }) {
        const sql = `
            SELECT 
                u.name AS editor_name, e.id_employee as editor_id, 
                SUM(we.quantity) AS total_hours
            FROM work_entries we
            JOIN employees e ON we.employee_id = e.id_employee
            JOIN users u ON e.user_id = u.id_user
            WHERE YEAR(we.date) = ?
              AND MONTH(we.date) = ?
            GROUP BY e.id_employee, u.name
            ORDER BY total_hours DESC
        `;
        return await executeQuery(sql, [year, month]);
    }

        // דוח 4: סיכום שעות לכל ספר
        async getBooksSummary({ month, year } = {}) {
            let where = [];
            let params = [];
            if (month && year) {
                where.push('YEAR(we.date) = ?');
                where.push('MONTH(we.date) = ?');
                params.push(year, month);
            }
            const sql = `
                SELECT 
                    we.book_id, we.book_name,
                    SUM(we.quantity) AS total_hours
                FROM work_entries we
                ${where.length ? 'WHERE ' + where.join(' AND ') : ''}
                GROUP BY we.book_id, we.book_name
                ORDER BY total_hours DESC
            `;
            return await executeQuery(sql, params);
        }
    
        // דוח 5: עובדים בספר
        async getBookEmployeesSummary(bookId, { month, year } = {}) {
            let where = ['we.book_id = ?'];
            let params = [bookId];
            if (month && year) {
                where.push('YEAR(we.date) = ?');
                where.push('MONTH(we.date) = ?');
                params.push(year, month);
            }
            const sql = `
                SELECT 
                    u.name AS employee_name, e.id_employee as employee_id, 
                    SUM(we.quantity) AS total_hours
                FROM work_entries we
                JOIN employees e ON we.employee_id = e.id_employee
                JOIN users u ON e.user_id = u.id_user
                WHERE ${where.join(' AND ')}
                GROUP BY e.id_employee, u.name
                ORDER BY total_hours DESC
            `;
            return await executeQuery(sql, params);
        }
    
        // דוח 6: כל השורות של עובד בספר
        async getBookEmployeeDetails(bookId, employeeId, { month, year } = {}) {
            let where = ['we.book_id = ?', 'we.employee_id = ?'];
            let params = [bookId, employeeId];
            if (month && year) {
                where.push('YEAR(we.date) = ?');
                where.push('MONTH(we.date) = ?');
                params.push(year, month);
            }
            const sql = `
                SELECT
                    we.date,
                    we.quantity,
                    we.description,
                    we.notes
                FROM work_entries we
                WHERE ${where.join(' AND ')}
                ORDER BY we.date
            `;
            return await executeQuery(sql, params);
        }
    
    }
