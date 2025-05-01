// // services/bookService.js
// import { ClickUpService } from './clickup/clickUpService.js';
// import { EmployeeService } from './employeesService.js';
// import { SimpleCache } from '../until/simpleCache.js';

// const booksCache = new SimpleCache(1000 * 60 * 25);

// export class BooksService {

//     constructor() {
//         this.clickUpService = new ClickUpService();
//         this.folderName = 'Our Projects';
//         this.listName = 'Current Projects';
//         this.requiredStatus = 'editing';
//         this.editorFieldName = 'Editor Information';
//     }

//     async getBooksForWorker(workerId, { start = 0, range = 10, sort = "name ASC" } = {}) {
//         const employeeService = new EmployeeService();
//         // שלב 1: מציאת ה־folder וה־list
//         const employeClickUpId = await employeeService.getClickUpIdByWorkerId(workerId);


//         const folderId = await this.clickUpService.getFolderIdByName(this.folderName);
//         const listsData = await this.clickUpService.getLists(folderId);
//         const currentList = listsData.lists.find(list => list.name === this.listName);

//         if (!currentList) {
//             throw new Error(`List "${this.listName}" not found.`);
//         }

//         const cacheKey = `${currentList.id}_${this.requiredStatus}`;
//         let tasks = booksCache.get(cacheKey); // ← מנסה להביא מה-cache    


//         if (!tasks) {
//             // לא קיים ב־cache – נמשוך מה-API
//             tasks = await this.getAllTasks(currentList.id);
//             booksCache.set(cacheKey, tasks); // ← שומר ב־cache
//         }
    
//         // שלב 2: משיכת כל המשימות מהרשימה (עם דפדוף בין דפים)
//         // const tasks = await this.getAllTasks(currentList.id);
//         const filteredTasks = tasks.filter(task => task.status.status === this.requiredStatus);

//         const workerTasks = filteredTasks.filter(task => {
//             const editorField = task.custom_fields.find(field => field.name === this.editorFieldName)?.value;
        
//             if (!editorField){
//                 return false;
//             } else{
//                 console.log("fail");
//             }
        
//             return editorField.some(editor => editor.id === employeClickUpId);
//         });
        
        

//         // שלב 5: החזרת שם ו־ID בלבד
//         const books = workerTasks.map(task => ({
//             id_book: task.id,
//             title: task.name
//         }));

//         // מיון לפי בקשה
//         books.sort((a, b) => {
//             const [field, order] = sort.split(' ');
//             const compareResult = a[field].localeCompare(b[field]);
//             return order.toUpperCase() === 'ASC' ? compareResult : -compareResult;
//         });

//         return books.slice(start, start + range);
//     }

//     // פונקציית עזר למשיכת כל המשימות מהרשימה
//     async getAllTasks(listId) {
//         let tasks = [];
//         let page = 0;
//         let lastPage = false;

//         while (!lastPage) {
//             const data = await this.clickUpService.getTasks(listId, page);
//             tasks.push(...data.tasks);
//             lastPage = data.last_page;
//             page++;
//         }

//         return tasks;
//     }
// }
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
        const employeClickUpId = await employeeService.getClickUpIdByWorkerId(workerId);

        const folderId = await this.clickUpService.getFolderIdByName(this.folderName);
        const listsData = await this.clickUpService.getLists(folderId);
        const currentList = listsData.lists.find(list => list.name === this.listName);

        if (!currentList) {
            throw new Error(`List "${this.listName}" not found.`);
        }

        const cacheKey = `${currentList.id}_${this.requiredStatus}`;
        let tasks = booksCache.get(cacheKey);

        if (!tasks) {
            tasks = await this.getAllTasks(currentList.id);
            booksCache.set(cacheKey, tasks);
        }

        const filteredTasks = tasks.filter(task => task.status.status === this.requiredStatus);

        const workerTasks = filteredTasks.filter(task => {
            const editorField = task.custom_fields.find(field => field.name === this.editorFieldName)?.value;
            return editorField?.some(editor => editor.id === employeClickUpId);
        });

        const books = workerTasks.map(task => ({
            id_book: task.id,
            title: task.name
        }));

        books.sort((a, b) => {
            const [field, order] = sort.split(' ');
            const compareResult = a[field].localeCompare(b[field]);
            return order.toUpperCase() === 'ASC' ? compareResult : -compareResult;
        });

        return books.slice(start, start + range);
    }

    async getAllBooks() {
        const folderId = await this.clickUpService.getFolderIdByName(this.folderName);
        const listsData = await this.clickUpService.getLists(folderId);
        const currentList = listsData.lists.find(list => list.name === this.listName);

        if (!currentList) {
            throw new Error(`List "${this.listName}" not found.`);
        }

        const tasks = await this.getAllTasks(currentList.id);
        return tasks.map(task => ({
            id_book: task.id,
            title: task.name
        }));
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
