// services/ProjectManagerService.js
import { getOfficeWorkersFromClickUp } from './clickup/clickupEmployeeService.js';
import { executeQuery } from '../config/db.js';
import { ClickUpService } from './clickup/clickUpService.js';



export async function  getProjectManagerNameById(clickup_id_employee) {
  if(!clickup_id_employee){
    return "";
  }
  const clickUpService = new ClickUpService();


      const query = `
    SELECT u.name
    FROM employees e
    JOIN users u ON e.user_id = u.id_user
    JOIN employee_roles er ON er.employee_id = e.id_employee
    JOIN roles r ON r.id_role = er.role_id
    WHERE e.clickup_id = ?
      AND r.role_name = 'Project Manager'
    LIMIT 1
  `;

    const results = await executeQuery(query, [clickup_id_employee]);

  if (results.length > 0) {
    return results[0].name;
  }


  const employee = await clickUpService.getTaskById(clickup_id_employee);
  return employee.name || "";
  }