import { ClickUpService } from './clickup/clickUpService.js';
import { EmployeeService } from './employeesService.js';
import { SimpleCache } from '../until/simpleCache.js';

const booksCache = new SimpleCache(1000 * 60 * 25);

export class BooksService {

    constructor() {
        this.clickUpService = new ClickUpService();
        this.folderName = 'Our Projects';
        this.listName = 'Current Projects';
        this.requiredStatus = 'editing';
        this.editorFieldName = 'Editor Information';
    }

    async getBooksForWorker(workerId, { start = 0, range = 10, sort = "name ASC" } = {}) {
        const employeeService = new EmployeeService();
        const employeeClickUpId = await employeeService.getClickUpIdByWorkerId(workerId);
    
        const [sortField, sortOrder] = sort.split(' ');
        const validSortField = ['name', 'id_book'].includes(sortField) ? sortField : 'name';
        const validSortOrder = sortOrder?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
    
        const query = `
            SELECT id_book, name AS title
            FROM books
            WHERE project_manager_clickup_id = ?
            ORDER BY ${validSortField} ${validSortOrder}
            LIMIT ?, ?
        `;
    
        const books = await executeQuery(query, [employeeClickUpId, start, range]);
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
