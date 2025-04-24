// // services/bookService.js
// import {executeQuery} from '../config/db.js';

// export class BooksService {
//     static table = "books";

//     // שליפת ספרים עבור עובד לפי ה-workerId
//     async getBooksForWorker(workerId, { start = 0, range = 10, sort = "title ASC" } = {}) {
//         // start, range, sort
//         const query = `SELECT books.id_book, books.title 
// FROM alehzayis.books 
// INNER JOIN alehzayis.employees_books ON books.id_book = employees_books.book_id
// INNER JOIN alehzayis.employees ON employees_books.employee_id = employees.id_employee
// INNER JOIN alehzayis.users ON employees.user_id = users.id_user
// WHERE users.id_user = ?`;
//         // ORDER BY ${sort} LIMIT ?, ?


        
//         const books = await executeQuery(query, [workerId]);
//         return books;
//     }

//     // יצירת ספר חדש עבור עובד
//     async createBook(workerId, { title, startDate }) {
//         const employeeQuery = "SELECT id_employee FROM employees WHERE user_id = ?";
//         const employees = await executeQuery(employeeQuery, [workerId]);

//         if (!employees.length) throw new Error("Employee not found");

//         const employeeId = employees[0].id_employee;

//         const query = `
//             INSERT INTO ${BooksService.table} (title, start_date)
//             VALUES (?, ?)`;

//         const values = [title, startDate];

//         const result = await executeQuery(query, values);

//         // קישור הספר לעובד
//         const userBooksQuery = `
//             INSERT INTO employees_books (employee_id, book_id)
//             VALUES (?, ?)`;
        
//         await executeQuery(userBooksQuery, [employeeId, result.insertId]);

//         return { id_book: result.insertId, title, startDate };
//     }
// }



// services/bookService.js
import { ClickUpService } from './clickup/clickUpService.js';
import { EmployeeService } from './employeesService.js';

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
        // שלב 1: מציאת ה־folder וה־list
        const employeClickUpId = await employeeService.getClickUpIdByWorkerId(workerId);


        const folderId = await this.clickUpService.getFolderIdByName(this.folderName);
        const listsData = await this.clickUpService.getLists(folderId);
        const currentList = listsData.lists.find(list => list.name === this.listName);

        if (!currentList) {
            throw new Error(`List "${this.listName}" not found.`);
        }

        // שלב 2: משיכת כל המשימות מהרשימה (עם דפדוף בין דפים)
        const tasks = await this.getAllTasks(currentList.id);
        const filteredTasks = tasks.filter(task => task.status.status === this.requiredStatus);
        // const editingTasks = tasks;

        const workerTasks = filteredTasks.filter(task => {
            const editorField = task.custom_fields.find(field => field.name === this.editorFieldName)?.value;
        
            if (!editorField){
                return false;
            } else{
                console.log("fail");
            }
        
            return editorField.some(editor => editor.id === employeClickUpId);
        });
        
        

        // שלב 5: החזרת שם ו־ID בלבד
        const books = workerTasks.map(task => ({
            id_book: task.id,
            title: task.name
        }));

        // מיון לפי בקשה
        books.sort((a, b) => {
            const [field, order] = sort.split(' ');
            const compareResult = a[field].localeCompare(b[field]);
            return order.toUpperCase() === 'ASC' ? compareResult : -compareResult;
        });

        return books.slice(start, start + range);
    }

    // פונקציית עזר למשיכת כל המשימות מהרשימה
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
