import express from 'express';
import { BooksController } from '../controllers/bookController.js';
import { verifyToken } from "../middleware/authenticateToken.js";

const bookRouter = express.Router();
const booksController = new BooksController();

bookRouter.get('/', verifyToken, booksController.getAllBooks);
bookRouter.get('/:workerId', verifyToken, booksController.getBooksForWorker);

export default bookRouter;
