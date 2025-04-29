import {executeQuery} from '../config/db.js';
import { fetchClickUpAPI } from '../config/clickUpApiConfig.js';

export class EmployeeService {

    async getAllEmployees() {
        const query = 'SELECT emplors.email, roles.name AS role FROM alehzayis.employees JOIN alehzayis.users ON employees.user_id = users.id_user JOIN alehzayis.roles ON employees.role_id = roles.id_role';
        const result = await executeQuery(query);
        return result;
    }


    async createEmployee(params) {
        const roleMap = {
            'Editors': 'Editor',
            'Typists': 'Typist',
            'Transcribers': 'Transcriber',
            'Project Management': 'Project Manager'
        };
    
        const normalizedRole = roleMap[params.role];
        if (!normalizedRole) {
            throw new Error(`Unknown role from ClickUp: ${params.role_id}`);
        }
    
        // שליפת ה-role_id מה-DB לפי role_name התקני
        const roleResult = await executeQuery(
            `SELECT id_role FROM alehZayis.roles WHERE role_name = ?`,
            [normalizedRole]
        );
    
        if (!roleResult.length) {
            throw new Error(`Role '${normalizedRole}' not found in roles table`);
        }
    
        const roleId = roleResult[0].id_role;
        
        const employeeQuery = `INSERT INTO alehzayis.employees (user_id, clickup_id, role_id) VALUES (?, ?, ?)`;
        const result = await executeQuery(employeeQuery, [params.user_id, params.clickup_id, roleId]);

        if (!result.insertId) {
            throw new Error('Failed to create employee');
        }

        return result.insertId;
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
