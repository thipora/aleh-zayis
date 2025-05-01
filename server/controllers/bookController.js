// controllers/bookController.js
import { BooksService } from '../services/bookService.js';

export class BooksController {
    static booksService = new BooksService();

    async getAllBooks(req, res, next) {
        try {
            const books = await BooksController.booksService.getAllBooks();
            res.json(books);
        } catch (ex) {
            next({
                statusCode: ex.errno || 500,
                message: ex.message || ex
            });
        }
    }

    async getBooksForWorker(req, res, next) {
        try {
            const { workerId } = req.params;
            const { start = 0, range = 10, sort = "title ASC" } = req.query;

            const books = await BooksController.booksService.getBooksForWorker(workerId, { start, range, sort });

            res.json(books);
        } catch (ex) {
            next({
                statusCode: ex.errno || 500,
                message: ex.message || ex
            });
        }
    }
}
