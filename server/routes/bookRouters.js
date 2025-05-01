// routes/bookRoutes.js
import express from 'express';
import { BooksController } from '../controllers/bookController.js';

const bookRouter = express.Router();
const booksController = new BooksController();

bookRouter.get('/', booksController.getAllBooks);
bookRouter.get('/:workerId', booksController.getBooksForWorker);

export default bookRouter;
