import { ClickUpService } from "./clickUpService.js";
const clickUpService = new ClickUpService();
const spaceId = process.env.CLICKUP_TEAM_ID || '8601991';
const folderName = 'Freelancer Database'


let clickupCache = null;
let lastFetchTime = 0;
const CACHE_TTL_MS = 1000 * 60 * 90;


export async function findUserByEmailInClickUp(email) {
  const users = await getClickUpEmployee();
  const matches = users.filter(user => user.email === email);

  if (matches.length === 0) return null;

  return {
    id: matches[0].id, // נניח שזה אותו ID בכל המופעים
    name: matches[0].name,
    email: matches[0].email,
    roles: matches.flatMap(user => user.roles || [user.role])
  };
}


// export async function getClickUpEmployee() {
//     const now = Date.now();
  
//     if (clickupCache && now - lastFetchTime < CACHE_TTL_MS) {
//       return clickupCache;
//     }
  
//     const freelancersFolderId = await clickUpService.getFolderIdByName("Freelancer Database");
//     const mazFolderId = await clickUpService.getFolderIdByName("MAZ Information");

//     const freelancerLists = await clickUpService.getLists(freelancersFolderId);
//     const mazLists = await clickUpService.getLists(mazFolderId);

//     const freelancers = await Promise.all(
//       freelancerLists.lists.map(async (list) => {
//         const tasksInList = await fetchTasksFromList(list.id);
//         return tasksInList.map(task => {
//           const email = task.custom_fields.find(field => field.name === 'Email')?.value;
    
//           const baseData = {
//             id: task.id,
//             name: task.name,
//             email
//           };
    
//           if (list.name === "Graphics & Layout") {
//             // שולף את כל התוויות בתור תפקידים
//             const roles = task.tags.map(tag => tag.name);
//             return { ...baseData, roles };
//           } else {
//             // שאר הרשימות – שם הרשימה הוא התפקיד היחיד
//             return { ...baseData, roles: list.name };
//           }
//         });
//       })
//     );
        


//     const officeList = mazLists.lists.find(list => list.name === 'Employee Information');

// let officeWorkers = [];
// if (officeList) {
//   const tasksInList = await fetchTasksFromList(officeList.id);

//   officeWorkers = tasksInList.map(task => {
//     const departmentField = task.custom_fields.find(field => field.name === 'Department');
//     const selectedId = departmentField?.value[0];
//     const selectedOption = departmentField?.type_config?.options.find(option => option.id === selectedId);
//     const roleName = selectedOption?.label;
//     return {
//       id: task.id,
//       name: task.name,
//       email: task.custom_fields.find(field => field.name === 'Email')?.value,
//       role: roleName
//     };
//   });
// }   

//     const allEmployees = [...officeWorkers.flat(), ...freelancers.flat()];
  
//     clickupCache = allEmployees;
//     lastFetchTime = now;
  
//     return clickupCache;
//   }

export async function getClickUpEmployee() {
  const now = Date.now();

  if (clickupCache && now - lastFetchTime < CACHE_TTL_MS) {
    return clickupCache;
  }

  const [freelancers, officeWorkers] = await Promise.all([
    getFreelancersFromClickUp(),
    getOfficeWorkersFromClickUp()
  ]);

  const allEmployees = [...officeWorkers, ...freelancers.flat()];

  clickupCache = allEmployees;
  lastFetchTime = now;

  return clickupCache;
}

export async function getOfficeWorkersFromClickUp() {
  const mazFolderId = await clickUpService.getFolderIdByName("MAZ Information");
  const mazLists = await clickUpService.getLists(mazFolderId);
  const officeList = mazLists.lists.find(list => list.name === 'Employee Information');

  if (!officeList) return [];

  const tasksInList = await fetchTasksFromList(officeList.id);

  return tasksInList.map(task => {
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


export async function getFreelancersFromClickUp() {
  const freelancersFolderId = await clickUpService.getFolderIdByName("Freelancer Database");
  const freelancerLists = await clickUpService.getLists(freelancersFolderId);

  return await Promise.all(
    freelancerLists.lists.map(async (list) => {
      const tasksInList = await fetchTasksFromList(list.id);
      return tasksInList.map(task => {
        const email = task.custom_fields.find(field => field.name === 'Email')?.value;
        const baseData = {
          id: task.id,
          name: task.name,
          email
        };

        if (list.name === "Graphics & Layout") {
          const roles = task.tags.map(tag => tag.name);
          return { ...baseData, roles };
        } else {
          return { ...baseData, roles: list.name };
        }
      });
    })
  );
}

  

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