import {executeQuery} from '../config/db.js';
import { fetchClickUpAPI } from '../config/clickUpApiConfig.js';

export class EmployeeService {

    async getAllEmployees() {
        const query = 'SELECT emplors.email, roles.name AS role FROM alehzayis.employees JOIN alehzayis.users ON employees.user_id = users.id_user JOIN alehzayis.roles ON employees.role_id = roles.id_role';
        const result = await executeQuery(query);
        return result;
    }


    // async createEmployee(params) {
    //     const roleMap = {
    //         'Editors': 'Editor',
    //         'Typists': 'Typist',
    //         'Transcribers': 'Transcriber',
    //         'Project Management': 'Project Manager'
    //     };
    
    //     const normalizedRole = roleMap[params.role];
    //     if (!normalizedRole) {
    //         throw new Error(`Unknown role from ClickUp: ${params.role_id}`);
    //     }
    
    //     // שליפת ה-role_id מה-DB לפי role_name התקני
    //     const roleResult = await executeQuery(
    //         `SELECT id_role FROM alehZayis.roles WHERE role_name = ?`,
    //         [normalizedRole]
    //     );
    
    //     if (!roleResult.length) {
    //         throw new Error(`Role '${normalizedRole}' not found in roles table`);
    //     }
    
    //     const roleId = roleResult[0].id_role;
        
    //     const employeeQuery = `INSERT INTO alehzayis.employees (user_id, clickup_id) VALUES (?, ?)`;
    //     const result = await executeQuery(employeeQuery, [params.user_id, params.clickup_id]);

    //     if (!result.insertId) {
    //         throw new Error('Failed to create employee');
    //     }

    //     const employeeId = result.insertId;

    //     // הכנסת הקשר לטבלת employee_roles
    //     await executeQuery(
    //         `INSERT INTO alehZayis.employee_roles (employee_id, role_id) VALUES (?, ?)`,
    //         [employeeId, roleId]
    //     );    

    //     return employeeId;
    // }


    async createEmployee(params) {
        const roleMap = {
            'Editors': 'Editor',
            'Typists': 'Typist',
            'Transcribers': 'Transcriber',
            'Project Management': 'Project Manager'
        };

        const { user_id, clickup_id, roles } = params;
      
        const insertEmployeeQuery = `INSERT INTO alehzayis.employees (user_id, clickup_id) VALUES (?, ?)`;
        const result = await executeQuery(insertEmployeeQuery, [user_id, clickup_id]);
      
        if (!result.insertId) {
          throw new Error("Failed to create employee");
        }
      
        const employeeId = result.insertId;
      
        for (const roleName of roles) {
          const normalizedRole = roleMap[roleName];
          if (!normalizedRole) continue;
      
          const roleResult = await executeQuery(
            `SELECT id_role FROM alehZayis.roles WHERE role_name = ?`,
            [normalizedRole]
          );
      
          if (roleResult.length) {
            const roleId = roleResult[0].id_role;
            await executeQuery(
              `INSERT INTO alehzayis.employee_roles (employee_id, role_id) VALUES (?, ?)`,
              [employeeId, roleId]
            );
          }
        }
      
        return employeeId;
    }
      

    async getEmployeeIdByUserId(userId) {
        const query = 'SELECT id_employee FROM alehZayis.employees WHERE user_id = ?';
        const result = await executeQuery(query, [userId]);
        return result.length > 0 ? result[0] : null;
    }


    async getClickUpEmployees(teamId) {
        const data = await fetchClickUpAPI(`https://api.clickup.com/api/v2/team/${teamId}/user`);
        if (data) {
            console.log(data);
            return data.users;
        }
        return [];
    }


    async getClickUpIdByWorkerId(workerId) {
        const query = 'SELECT clickup_id FROM alehZayis.employees WHERE id_employee = ?';
        const result = await executeQuery(query, [workerId]);

        if (result.length === 0) {
            throw new Error(`Employee with ID ${workerId} not found.`);
        }

        return result[0].clickup_id;
    }

}
