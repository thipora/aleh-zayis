import { executeQuery } from "../config/db.js";
import { getProjectManagerNameById } from './projectManagerService.js'

export class ReportsService {
  async getBookSummary(bookId, month = null, year = null) {
    const workEntries = await this.getWorkEntriesByBookId(bookId, month, year);
    const groupedByRole = this.groupWorkEntriesByRole(workEntries);
    return groupedByRole
  }


  async getWorkEntriesByBookId(bookId, month, year) {
    let sql = `
    SELECT
      we.quantity,
      we.is_special_work,
      er.hourly_rate,
      er.special_rate,
      r.role_name,
      r.special_unit,
      e.id_employee,
      u.name AS employee_name,
      e.currency
    FROM work_entries we
    JOIN employee_roles er ON we.employee_role_id = er.id_employee_role
    JOIN roles r ON er.role_id = r.id_role
    JOIN employees e ON er.employee_id = e.id_employee
    JOIN users u ON e.user_id = u.id_user
    JOIN books b ON b.id_book = we.book_id
    WHERE b.AZ_book_id = ?
  `;
    const params = [bookId];

    if (month && year) {
      sql += ` AND MONTH(we.date) = ? AND YEAR(we.date) = ?`;
      params.push(month, year);
    }

    return await executeQuery(sql, params);
  }


  groupWorkEntriesByRole(workEntries) {
    const rolesMap = {};

    for (const entry of workEntries) {
      const role = entry.role_name;
      const empId = entry.id_employee;
      const empName = entry.employee_name;
      const isSpecial = entry.is_special_work === 1;
      const rate = isSpecial ? entry.special_rate : entry.hourly_rate;
      const total = parseFloat(entry.quantity) * rate;
      const currency = entry.currency || 'USD';

      if (!rolesMap[role]) {
        rolesMap[role] = {};
      }

      if (!rolesMap[role][empId]) {
        rolesMap[role][empId] = {
          employee_id: empId,
          employee_name: empName,
          quantity: 0,
          rate: rate,
          total: 0,
          currency: currency
        };
      }

      rolesMap[role][empId].quantity += parseFloat(entry.quantity);
      rolesMap[role][empId].total += total;
    }

    const result = Object.entries(rolesMap).map(([role_name, empMap]) => ({
      role_name,
      employees: Object.values(empMap)
    }));

    return result;
  }

  async getMonthlyBooksSummary(month, year) {
    const sql = `
    SELECT 
      b.AZ_book_id,
      b.name AS book_name,
      b.project_manager_clickup_id,
      u_pm.name AS projectManagerName,
      SUM(we.quantity * IF(we.is_special_work = 1, er.special_rate, er.hourly_rate)) AS total_payment,
      SUM(CASE WHEN r.special_unit = 'hours' THEN we.quantity ELSE 0 END) AS total_hours,
      SUM(CASE WHEN r.special_unit != 'hours' THEN we.quantity ELSE 0 END) AS total_quantity,
      e.currency
    FROM work_entries we
    JOIN employee_roles er ON we.employee_role_id = er.id_employee_role
    JOIN roles r ON er.role_id = r.id_role
    JOIN employees e ON er.employee_id = e.id_employee
    JOIN books b ON we.book_id = b.id_book
    LEFT JOIN employees e_pm ON e_pm.clickup_id = b.project_manager_clickup_id
    LEFT JOIN users u_pm ON e_pm.user_id = u_pm.id_user
    WHERE MONTH(we.date) = ? AND YEAR(we.date) = ?
    GROUP BY b.id_book, e.currency
    ORDER BY b.name;
  `;

    const rows = await executeQuery(sql, [month, year]);

    for (const row of rows) {
      if (!row.projectManagerName && row.project_manager_clickup_id) {
        try {
          const clickUpUser = await getProjectManagerNameById(row.project_manager_clickup_id);
          row.projectManagerName = clickUpUser || "לא ידוע";
        } catch (error) {
          console.error("שגיאה בשליפת מנהל מפרויקט מ-ClickUp:", error);
          row.projectManagerName = "שגיאה בשליפה";
        }
      }
    }

    return rows;
  }

  async getAllBooksSummary() {
    const sql = `
    SELECT 
      b.AZ_book_id,
      b.name AS book_name,
      b.project_manager_clickup_id,
      u_pm.name AS projectManagerName,
      SUM(we.quantity * IF(we.is_special_work = 1, er.special_rate, er.hourly_rate)) AS total_payment,
      SUM(CASE WHEN r.special_unit = 'hours' THEN we.quantity ELSE 0 END) AS total_hours,
      SUM(CASE WHEN r.special_unit != 'hours' THEN we.quantity ELSE 0 END) AS total_quantity,
      e.currency
    FROM work_entries we
    JOIN employee_roles er ON we.employee_role_id = er.id_employee_role
    JOIN roles r ON er.role_id = r.id_role
    JOIN employees e ON er.employee_id = e.id_employee
    JOIN books b ON we.book_id = b.id_book
    LEFT JOIN employees e_pm ON e_pm.clickup_id = b.project_manager_clickup_id
    LEFT JOIN users u_pm ON e_pm.user_id = u_pm.id_user
    GROUP BY b.id_book, e.currency
    ORDER BY b.name;
  `;

    const rows = await executeQuery(sql);

    for (const row of rows) {
      if (!row.projectManagerName && row.project_manager_clickup_id) {
        try {
          const clickUpUser = await getProjectManagerNameById(row.project_manager_clickup_id);
          row.projectManagerName = clickUpUser || "לא ידוע";
        } catch (error) {
          console.error("שגיאה בשליפת מנהל מפרויקט מ-ClickUp:", error);
          row.projectManagerName = "שגיאה בשליפה";
        }
      }
    }

    return rows;
  }

}
