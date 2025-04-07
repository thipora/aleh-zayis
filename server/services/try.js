import { ClickUpService } from "./clickUpService.js";
const clickUpService = new ClickUpService();
const spaceId = process.env.CLICKUP_TEAM_ID || '8601991';
const folderName = 'Freelancer Database'


export async function findUserByEmailInClickUp(email) {
    const users = await getClickUpEmployee();
    return users.find(user => user.email === email) || null;
}

export async function getClickUpEmployee() {
    //give id of the folder whith name 'Freelancer Database'.
    const folderId = await getFolderIdByName(folderName);
    //give all lists that have in this folder.
    const data = await clickUpService.getLists(folderId);
    //give all tasks that have in this lists.
    const tasks = await Promise.all(data.lists.map(list => fetchTasksFromList(list.id)));
    //give ID of all this tasks.
    const tasksWithIdAndEmail = tasks.flatMap(list =>
        list.map(task => ({ id: task.id, name: task.name, email: task.custom_fields.find(field => field.name === 'Email').value }))
    );

    return tasksWithIdAndEmail;
}


export async function getFolderIdByName(folderName) {
    try {
        const data = await clickUpService.getFolders(); // קריאה לפונקציה שמביאה את כל התיקיות
        const folder = data.folders.find(folder => folder.name === folderName); // מחפש תיקיה עם השם המתאים
        return folder.id
        } catch (error) {
        console.error('שגיאה בהבאת התיקיות:', error);
    }
}

async function fetchTasksFromList(listId) {
    let allTasks = [];
    let page = 0;
    let lastPage = false;

    while (!lastPage) {
        try{
            const response = await clickUpService.getTasks(listId, page);
            allTasks.push(...response.tasks);
            lastPage = response.last_page;
            page++;
        } catch(error){
            console.error("error: " + error);
        }
    }

    return allTasks;
}