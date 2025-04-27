import { executeQuery } from '../config/db.js';

export class SummaryService {
    static table = "work_entries";

    // סיכום לפי חודש (מחזיר לכל ספר כמה שעות באותו חודש)
    async getSummaryByMonth(employeeId, month) {
        const sql = `
            SELECT book_id, book_name, SUM(quantity) AS total_hours
            FROM ${SummaryService.table}
            WHERE employee_id = ? AND DATE_FORMAT(date, '%Y-%m') = ?
            GROUP BY book_id, book_name
            ORDER BY total_hours DESC
        `;
        return await executeQuery(sql, [employeeId, month]);
    }

    // סיכום לפי ספר (מחזיר לכל חודש כמה שעות באותו ספר)
    async getSummaryByBook(employeeId, bookId) {
        const sql = `
            SELECT DATE_FORMAT(date, '%Y-%m') AS month, SUM(quantity) AS total_hours
            FROM ${SummaryService.table}
            WHERE employee_id = ? AND book_id = ?
            GROUP BY month
            ORDER BY month DESC
        `;
        return await executeQuery(sql, [employeeId, bookId]);
    }

    // כאן אפשר להוסיף סיכומים נוספים (שנתי, ממוצעים, דוחות מפורטים וכו')
}
