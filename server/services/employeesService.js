import { executeQuery } from '../config/db.js';
import { fetchClickUpAPI } from '../config/clickUpApiConfig.js';

export class EmployeeService {

  async getAllEmployees() {
    const query = 'SELECT employees.id_employee, employees.availability_status, users.id_user, COALESCE(users.en_name, users.name) AS name, users.email, roles.role_name AS role FROM employees JOIN users ON employees.user_id = users.id_user JOIN employee_roles er ON er.employee_id = employees.id_employee JOIN roles ON er.role_id = roles.id_role';
    const result = await executeQuery(query);

    const employeesMap = {};

    for (const row of result) {
      const { id_employee, name, email, availability_status, role, id_user } = row;

      if (!employeesMap[id_employee]) {
        employeesMap[id_employee] = {
          id_user,
          id_employee,
          name,
          email,
          availability_status,
          roles: [role],
          en_name: row.en_name || null
        };
      } else {
        employeesMap[id_employee].roles.push(role);
      }
    }

    return Object.values(employeesMap);
  }

  async createEmployee(params, connection) {
    const roleMap = {
      'Editors': 'Editor',
      'Typists': 'Typist',
      'Transcribers': 'Transcriber',
      'graphics': 'Graphics',
      'layout': 'Layout',
      'Project Management': 'Project Manager'
    };

    const { user_id, clickup_id, roles } = params;

    const [employeeResult] = await connection.execute(
      `INSERT INTO employees (user_id, clickup_id) VALUES (?, ?)`,
      [user_id, clickup_id]
    );

    const employeeId = employeeResult.insertId;

    for (const roleName of roles) {
      const normalizedRole = roleMap[roleName];
      if (!normalizedRole) continue;

      const [roleResult] = await connection.execute(
        `SELECT id_role FROM roles WHERE role_name = ?`,
        [normalizedRole]
      );

      if (roleResult.length) {
        const roleId = roleResult[0].id_role;
        await connection.execute(
          `INSERT INTO employee_roles (employee_id, role_id) VALUES (?, ?)`,
          [employeeId, roleId]
        );
      }
    }

    return employeeId;
  }


  async putStatusAvailability({ employeeId, availability_status }) {
    const sql = `UPDATE employees SET availability_status = ? WHERE id_employee = ?`;
    return await executeQuery(sql, [availability_status, employeeId]);
  }

  async getEmployeeIdByUserId(userId) {
    const query = 'SELECT id_employee, availability_status FROM employees WHERE user_id = ?';
    const result = await executeQuery(query, [userId]);
    return result.length > 0 ? result[0] : null;
  }

  async getEmployeeById(employeeId) {
    const query = `
      SELECT u.*, e.currency
      FROM users u
      JOIN employees e ON e.user_id = u.id_user
      WHERE e.id_employee = ?
    `;
    const result = await executeQuery(query, [employeeId]);

    if (result.length === 0) {
      throw new Error(`Employee with ID ${employeeId} not found.`);
    }

    return result[0];
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
    const query = 'SELECT clickup_id FROM employees WHERE id_employee = ?';
    const result = await executeQuery(query, [workerId]);

    if (result.length === 0) {
      throw new Error(`Employee with ID ${workerId} not found.`);
    }

    return result[0].clickup_id;
  }

  async getEmployeeCurrencyById(employeeId) {
    const query = 'SELECT currency FROM employees WHERE id_employee = ?';
    const result = await executeQuery(query, [employeeId]);
    return result.length > 0 ? result[0] : null;
  }

  async updateCurrency(employeeId, currency) {
    const query = `
        UPDATE employees
        SET currency = ?
        WHERE id_employee = ?
    `;
    await executeQuery(query, [currency, employeeId]);
  }

}
