
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
                book_name
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

    async createWorkEntry(employeeId, { date, quantity, description, notes, book_id, book_name }) 
        {
        const query = `
            INSERT INTO ${WorkEntriesService.table}
            (employee_id, date, quantity, description, notes, book_id, book_name)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;

        const values = [employeeId, date, quantity, description, notes, book_id, book_name];

        const result = await executeQuery(query, values);
        return {
            id_work_entries: result.insertId, employeeId, date, quantity, description, notes, book_id, book_name };
    }
}
