// services/bookService.js
import executeQuery from '../config/db.js';

export class BooksService {
    static table = "books";

    // שליפת ספרים עבור עובד לפי ה-workerId
    async getBooksForWorker(workerId, { start = 0, range = 10, sort = "title ASC" } = {}) {
        // start, range, sort
        const query = `SELECT books.id_book, books.title 
FROM alehzayis.books 
INNER JOIN alehzayis.employees_books ON books.id_book = employees_books.book_id
INNER JOIN alehzayis.employees ON employees_books.employee_id = employees.id_employee
INNER JOIN alehzayis.users ON employees.user_id = users.id_user
WHERE users.id_user = ?`;
        // ORDER BY ${sort} LIMIT ?, ?


        
        const books = await executeQuery(query, [workerId]);
        return books;
    }

    // יצירת ספר חדש עבור עובד
    async createBook(workerId, { title, startDate }) {
        const employeeQuery = "SELECT id_employee FROM employees WHERE user_id = ?";
        const employees = await executeQuery(employeeQuery, [workerId]);

        if (!employees.length) throw new Error("Employee not found");

        const employeeId = employees[0].id_employee;

        const query = `
            INSERT INTO ${BooksService.table} (title, start_date)
            VALUES (?, ?)`;

        const values = [title, startDate];

        const result = await executeQuery(query, values);

        // קישור הספר לעובד
        const userBooksQuery = `
            INSERT INTO employees_books (employee_id, book_id)
            VALUES (?, ?)`;
        
        await executeQuery(userBooksQuery, [employeeId, result.insertId]);

        return { id_book: result.insertId, title, startDate };
    }
}
