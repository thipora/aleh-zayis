// controllers/bookController.js
import { BooksService } from '../services/bookService.js';

export class BooksController {
    static booksService = new BooksService();

    // שליפת הספרים עבור עובד לפי ה-workerId
    async getBooksForWorker(req, res, next) {
        try {
            const { workerId } = req.params;  // שליפת ה-workerId מהנתיב
            const { start = 0, range = 10, sort = "title ASC" } = req.query;  // פרמטרים של סינון ודירוג

            const books = await BooksController.booksService.getBooksForWorker(workerId, { start, range, sort });
            // const books = await BooksController.booksService.getBooksForWorker(workerId);

            res.json(books);
        } catch (ex) {
            next({
                statusCode: ex.errno || 500,
                message: ex.message || ex
            });
        }
    }

    // יצירת ספר חדש עבור עובד
    async createBook(req, res, next) {
        try {
            const { workerId } = req.params;  // שליפת ה-workerId מהנתיב
            const { title, startDate } = req.body;  // פרטי הספר החדש

            const newBook = await BooksController.booksService.createBook(workerId, { title, startDate });
            return res.status(201).json(newBook);  // ספר חדש נוסף בהצלחה
        } catch (ex) {
            next({
                statusCode: ex.errno || 500,
                message: ex.message || ex
            });
        }
    }
}
