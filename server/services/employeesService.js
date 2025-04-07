import {executeQuery} from '../config/db.js';
import { fetchClickUpAPI } from '../config/clickUpApiConfig.js';

export class EmployeeService {

    async getAllEmployees() {
        const query = 'SELECT emplors.email, roles.name AS role FROM alehzayis.employees JOIN alehzayis.users ON employees.user_id = users.id_user JOIN alehzayis.roles ON employees.role_id = roles.id_role';
        const result = await executeQuery(query);
        return result;
    }


    async createEmployee(params) {
            const employeeQuery = `INSERT INTO alehzayis.employees (user_id, clickup_id) VALUES (?, ?)`;
            const result = await executeQuery(employeeQuery, [params.user_id, params.clickup_id]);
    
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
}
