import { ClickUpService } from "./clickUpService.js";
const clickUpService = new ClickUpService();
const spaceId = process.env.CLICKUP_TEAM_ID || '8601991';
const folderName = 'Freelancer Database'


let clickupCache = null;
let lastFetchTime = 0;
const CACHE_TTL_MS = 1000 * 60 * 10;


export async function findUserByEmailInClickUp(email) {
    const users = await getClickUpEmployee();
    return users.find(user => user.email === email) || null;
}

export async function getClickUpEmployee() {
    const now = Date.now();
  
    if (clickupCache && now - lastFetchTime < CACHE_TTL_MS) {
      return clickupCache;
    }
  
    // const folderId = await clickUpService.getFolderIdByName(folderName);
    const freelancersFolderId = await clickUpService.getFolderIdByName("Freelancer Database");
    const mazFolderId = await clickUpService.getFolderIdByName("MAZ Information");


    // const data = await clickUpService.getLists(folderId);
    const freelancerLists = await clickUpService.getLists(freelancersFolderId);
    const mazLists = await clickUpService.getLists(mazFolderId);

    // const tasks = await Promise.all(data.lists.map(list => fetchTasksFromList(list.id)));
    // const tasksWithIdAndEmail = tasks.flatMap(list =>
    //   list.map(task => ({
    //     id: task.id,
    //     name: task.name,
    //     email: task.custom_fields.find(field => field.name === 'Email')?.value,
    //     role: task.list.name
    //   }))
    // );
    const freelancers = await Promise.all(
      freelancerLists.lists.map(async (list) => {
        const tasksInList = await fetchTasksFromList(list.id);
        return tasksInList.map(task => ({
          id: task.id,
          name: task.name,
          email: task.custom_fields.find(field => field.name === 'Email')?.value,
          role: list.name  // ← ברור שזה בא מה-list
        }));
      })
    );


    const officeList = mazLists.lists.find(list => list.name === 'Employee Information');

let officeWorkers = [];
if (officeList) {
  const tasksInList = await fetchTasksFromList(officeList.id);

  officeWorkers = tasksInList.map(task => {
    const departmentField = task.custom_fields.find(field => field.name === 'Department');
    const selectedId = departmentField?.value[0];
    const selectedOption = departmentField?.type_config?.options.find(option => option.id === selectedId);
    const roleName = selectedOption?.label;
    return {
      id: task.id,
      name: task.name,
      email: task.custom_fields.find(field => field.name === 'Email')?.value,
      role: roleName
    };
  });
}

    // const officeWorkers = await Promise.all(
    //   mazLists.lists.map(async (list) => {
    //     const tasksInList = await fetchTasksFromList(list.id);
    //     return tasksInList.map(task => ({
    //       id: task.id,
    //       name: task.name,
    //       email: task.custom_fields.find(field => field.name === 'Email')?.value,
    //       role: task.custom_fields.find(field => field.name === 'Department')?.value  // שדה מותאם אישית
    //     }));
    //   })
    // );
    

    const allEmployees = [...officeWorkers.flat(), ...freelancers.flat()];
  
    // clickupCache = tasksWithIdAndEmail;
    clickupCache = allEmployees;
    lastFetchTime = now;
  
    return clickupCache;
  }
  

// export async function getFolderIdByName(folderName) {
//     try {
//         const data = await clickUpService.getFolders();
//         const folder = data.folders.find(folder => folder.name === folderName);
//         return folder.id;
//     } catch (error) {
//         console.error('שגיאה בהבאת התיקיות:', error);
//     }
// }


async function fetchTasksFromList(listId) {
    let allTasks = [];
    let page = 0;
    let lastPage = false;

    while (!lastPage) {
        try {
            const response = await clickUpService.getTasks(listId, page);
            allTasks.push(...response.tasks);
            lastPage = response.last_page;
            page++;
        } catch (error) {
            console.error("error: " + error);
        }
    }

    return allTasks;
}