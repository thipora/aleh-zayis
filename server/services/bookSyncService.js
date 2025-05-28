import { ClickUpService } from './clickup/clickUpService.js';
import { executeQuery } from '../config/db.js';
import { getOfficeWorkersFromClickUp } from './clickup/clickupEmployeeService.js'

const clickUpService = new ClickUpService();

export async function fetchBooksFromClickUp() {
  const folderId = await clickUpService.getFolderIdByName("Our Projects");
  const lists = await clickUpService.getLists(folderId);
  const currentProjectsList = lists.lists.find(list => list.name === "Current Projects");
  if (!currentProjectsList) {
    throw new Error("Current Projects list not found in ClickUp");
  }

  const tasks = await fetchTasksFromList(currentProjectsList.id);
  const allEmployees = await getOfficeWorkersFromClickUp();

  const books = [];

  for (const task of tasks) {
    const name = task.name;
    const clickup_id = task.id;
    const AZ_book_id = task.custom_id;

    const managerField = task.custom_fields.find(f => f.name === 'Manager');
    const managerIndex = managerField?.value;
    const managerOption = managerField?.type_config?.options?.[managerIndex];
    const managerName = managerOption?.name;

    const matchingEmployee = allEmployees.find(e => e.name.includes(managerName));
    const projectManagerClickupId = matchingEmployee?.id || null;

    books.push({
      name,
      clickup_id,
      project_manager_clickup_id: projectManagerClickupId,
      AZ_book_id
    });
  }

  return books;
}

async function fetchTasksFromList(listId) {
  let allTasks = [];
  let page = 0;
  let lastPage = false;

  while (!lastPage) {
    const response = await clickUpService.getTasks(listId, page);
    allTasks.push(...response.tasks);
    lastPage = response.last_page;
    page++;
  }

  return allTasks;
}


export async function syncBooksToDatabase() {
  const books = await fetchBooksFromClickUp();

  for (const book of books) {
    const existing = await executeQuery(
      'SELECT id_book FROM books WHERE clickup_id = ?',
      [book.clickup_id]
    );

    if (existing.length > 0) {
      await executeQuery(
        `UPDATE books SET name = ?, project_manager_clickup_id = ?, AZ_book_id = ? WHERE clickup_id = ?`,
        [book.name, book.project_manager_clickup_id, book.AZ_book_id, book.clickup_id]
      );
    } else {
      await executeQuery(
        `INSERT INTO books (clickup_id, name, project_manager_clickup_id, AZ_book_id) VALUES (?, ?, ?, ?)`,
        [book.clickup_id, book.name, book.project_manager_clickup_id, book.AZ_book_id]
      );
    }
  }
}