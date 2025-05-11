import { ClickUpService } from './clickup/clickUpService.js';
import { EmployeeService } from './employeesService.js';
import { SimpleCache } from '../util/simpleCache.js';
import { executeQuery } from "../config/db.js";


const booksCache = new SimpleCache(1000 * 60 * 25);

export class BooksService {

    constructor() {
        this.clickUpService = new ClickUpService();
        this.folderName = 'Our Projects';
        this.listName = 'Current Projects';
        this.requiredStatus = 'editing';
        this.editorFieldName = 'Editor Information';
    }

    // async getBooksForWorker(workerId, { start = 0, range = 10, sort = "name ASC" } = {}) {
    //     const employeeService = new EmployeeService();
    //     const employeeClickUpId = await employeeService.getClickUpIdByWorkerId(workerId);
    
    //     const [sortField, sortOrder] = sort.split(' ');
    //     const validSortField = ['name', 'id_book'].includes(sortField) ? sortField : 'name';
    //     const validSortOrder = sortOrder?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
    
    //     const query = `
    //         SELECT id_book, name AS title
    //         FROM books
    //         WHERE project_manager_clickup_id = ?
    //         ORDER BY ${validSortField} ${validSortOrder}
    //         LIMIT ?, ?
    //     `;
    
    //     const books = await executeQuery(query, [employeeClickUpId, start, range]);
    //     return books;
    // }

    async getBooksForWorker(workerId, { sort = "name ASC" } = {}) {
        const [sortField, sortOrder] = sort.split(' ');
        const validSortField = ['name', 'id_book'].includes(sortField) ? sortField : 'name';
        const validSortOrder = sortOrder?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
      
        const query = `
          SELECT DISTINCT books.id_book, books.AZ_book_id, books.name AS title
          FROM books
          JOIN book_assignments ON books.id_book = book_assignments.book_id
          JOIN employee_roles ON book_assignments.employee_role_id = employee_roles.id_employee_role
          WHERE employee_roles.employee_id = ?
        ORDER BY ${validSortField} ${validSortOrder}
        `;

      
        const books = await executeQuery(query, [workerId]);
        return books;
      }
      
    

    async getAllBooks() {
        const query = 'SELECT id_book, name AS title FROM books';
        const books = await executeQuery(query); // ודא שהפונקציה הזאת זמינה לך
    
        return books;
    }
    

    async getAllTasks(listId) {
        let tasks = [];
        let page = 0;
        let lastPage = false;

        while (!lastPage) {
            const data = await this.clickUpService.getTasks(listId, page);
            tasks.push(...data.tasks);
            lastPage = data.last_page;
            page++;
        }

        return tasks;
    }
}
