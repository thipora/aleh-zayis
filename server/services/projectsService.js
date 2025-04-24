// import { executeQuery } from '../config/db.js';
// import { ClickupProjectsService } from './clickup/clickupProjectsService.js';
// const clickupProjectsService = new ClickupProjectsService()

// export class ProjectsService {
//   async getProjectsByEmployeeId(employeeId) {
//     const [employee] = await executeQuery(
//       'SELECT clickup_id FROM employees WHERE id_employee = ?',
//       [employeeId]
//     );

//     if (!employee) {
//       throw new Error('Employee not found');
//     }

//     const clickupUserId = employee.clickup_id;
//     const projects = await clickupProjectsService.getProjectsByUser(clickupUserId);

//     return projects;
//   }
// }
