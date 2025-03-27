// routes/bookRoutes.js
import express from 'express';
import { BooksController } from '../controllers/bookController.js';

const bookRouter = express.Router();
const booksController = new BooksController();

// שליפת ספרים לעובד לפי ה-workerId
bookRouter.get('/:workerId', booksController.getBooksForWorker);

// יצירת ספר חדש
bookRouter.post('/:workerId', booksController.createBook);

export default bookRouter;
