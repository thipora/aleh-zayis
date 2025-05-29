import { executeQuery } from '../config/db.js';
import { calculateWorkQuantityFromTimes } from '../util/timeUtils.js'
import { getProjectManagerNameById } from './projectManagerService.js'

export class WorkEntriesService {
  static table = "work_entries";

  async getWorkEntriesByEmployee(employeeId, { month, year, projectId, start = 0, range = 10 } = {}) {
    const conditions = ['er.employee_id = ?'];
    const values = [Number(employeeId)];

    if (month && year) {
      conditions.push('MONTH(we.date) = ?');
      conditions.push('YEAR(we.date) = ?');
      values.push(month, year);
    }

    if (projectId) {
      conditions.push('we.book_id = ?');
      values.push(projectId);
    }

    const query = `
      SELECT 
        we.id_work_entries,
        we.date,
        we.quantity,
        we.description,
        we.notes,
        we.start_time,
        we.end_time,
        b.id_book,
        b.name AS book_name,
        b.clickup_id,
        b.project_manager_clickup_id,
        b.AZ_book_id,
        r.role_name,
        r.special_unit,
        we.is_special_work
      FROM work_entries we
      JOIN employee_roles er ON we.employee_role_id = er.id_employee_role
      JOIN employees e ON er.employee_id = e.id_employee
      JOIN roles r ON er.role_id = r.id_role
      JOIN books b ON we.book_id = b.id_book
      WHERE ${conditions.join(' AND ')}
      ORDER BY we.date DESC, we.id_work_entries DESC
    `;

    const entries = await executeQuery(query, values);

    const entriesWithManager = await Promise.all(entries.map(async entry => {
      const managerName = await getProjectManagerNameById(entry.project_manager_clickup_id);
      return {
        ...entry,
        project_manager_name: managerName
      };
    }));

    return entriesWithManager;
  }





  async updateWorkEntrie(workEntrieId, { date, quantity, description, notes }) {
    const updateFields = [];
    const values = [];

    if (date) updateFields.push("date = ?") && values.push(date);
    if (quantity) updateFields.push("quantity = ?") && values.push(quantity);
    if (description) updateFields.push("description = ?") && values.push(description);
    if (notes) updateFields.push("notes = ?") && values.push(notes);

    const query = `
      UPDATE ${WorkEntriesService.table}
      SET ${updateFields.join(", ")}
      WHERE id_work_entries = ?
    `;

    values.push(workEntrieId);
    return await executeQuery(query, values);
  }


  async createWorkEntry(employeeId, { roleId, date, quantity, description, notes, book_id, start_time, end_time }) {
    const [empRole] = await executeQuery(`
      SELECT er.id_employee_role, er.hourly_rate, er.special_rate, ba.custom_rate
      FROM employee_roles er
      LEFT JOIN book_assignments ba
        ON ba.employee_role_id = er.id_employee_role AND ba.book_id = ?
      WHERE er.employee_id = ? AND er.role_id = ?
    `, [book_id, employeeId, roleId]);
    if (!empRole) {
      throw new Error('Employee role not found');
    }
    const employeeRoleId = empRole.id_employee_role;
    let is_special_work = true;
    if (quantity == 0) {
      is_special_work = false;
      const calculated = calculateWorkQuantityFromTimes(start_time, end_time);
      if (calculated) quantity = calculated;
    }

    const applied_rate =
  empRole.custom_rate ??
  (is_special_work ? empRole.special_rate : empRole.hourly_rate);

    const query = `
      INSERT INTO ${WorkEntriesService.table}
      (employee_role_id, date, quantity, description, notes, book_id, start_time, end_time, is_special_work, applied_rate)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [employeeRoleId, date, quantity, description, notes, book_id, start_time, end_time, is_special_work, applied_rate];
    const result = await executeQuery(query, values);
    return {
      id_work_entries: result.insertId,
      employee_role_id: employeeRoleId,
      date, quantity, description, notes, book_id, start_time, end_time
    };
  }


  async getMonthlyWorkSummaryByEmployees({ month, year }) {
    const workEntries = await this.getMonthlyWorkEntriesWithDetails(month, year);
    return this.summarizeWorkEntriesWithRates(workEntries);
  }


  async getMonthlyWorkEntriesWithDetails(month, year) {
    const sql = `
      SELECT
        we.employee_role_id,
        we.quantity,
        we.is_special_work,
        we.applied_rate,
        r.role_name,
        r.special_unit,
        e.id_employee,
        u.name AS employee_name,
        u.email AS employee_email
      FROM work_entries we
      JOIN employee_roles er ON we.employee_role_id = er.id_employee_role
      JOIN roles r ON er.role_id = r.id_role
      JOIN employees e ON er.employee_id = e.id_employee
      JOIN users u ON e.user_id = u.id_user
      WHERE MONTH(we.date) = ? AND YEAR(we.date) = ?
      `;
    return await executeQuery(sql, [month, year]);
  }


  summarizeWorkEntriesWithRates(workEntries) {
    const summary = {};

    for (const entry of workEntries) {
      const empId = entry.id_employee;
      const name = entry.employee_name;
      const email = entry.employee_email;
      const isSpecial = entry.is_special_work === 1;
      const rate = parseFloat(entry.applied_rate);
      const unit = entry.special_unit || 'unit';

      if (!summary[empId]) {
        summary[empId] = {
          employee_id: empId,
          employee_name: name,
          employee_email: email,
          hours: 0,
          specials: {},
          role_name: entry.role_name
        };
      }

      if (isSpecial) {
        if (!summary[empId].specials[unit]) {
          summary[empId].specials[unit] = {
            quantity: 0,
            rate: rate
          };
        }
        summary[empId].specials[unit].quantity += parseFloat(entry.quantity);
      } else {
        summary[empId].hours += parseFloat(entry.quantity);
        summary[empId].hourly_rate = rate;
      }
    }

    const result = [];
    Object.values(summary).forEach(emp => {
      if (emp.hours > 0) {
        result.push({
          employee_id: emp.employee_id,
          employee_name: emp.employee_name,
          employee_email: emp.employee_email,
          type: 'hours',
          quantity: emp.hours,
          rate: emp.hourly_rate,
          total: +(emp.hours * emp.hourly_rate).toFixed(2),
          role_name: emp.role_name
        });
      }

      Object.entries(emp.specials).forEach(([unit, data]) => {
        result.push({
          employee_id: emp.employee_id,
          employee_name: emp.employee_name,
          employee_email: emp.employee_email,
          type: 'special',
          unit,
          quantity: data.quantity,
          rate: data.rate,
          total: +(data.quantity * data.rate).toFixed(2),
          role_name: emp.role_name
        });
      });
    });

    return result;
  }


  async getMonthlySummaryByEmployee(employeeId, { month, year }) {
    const workEntries = await this.getWorkEntriesByEmployeeId(employeeId, month, year);
    const summary = await this.summarizeWorkEntriesByBook(workEntries);
    return summary;
  }

  async getWorkEntriesByEmployeeId(employeeId, month, year) {
    const sql = `
      SELECT
        we.quantity,
        we.is_special_work,
        we.applied_rate,
        r.role_name,
        we.book_id,
        b.name AS book_name,
        b.AZ_book_id,
        b.project_manager_clickup_id,
        r.special_unit,
        u_pm.name AS project_manager_name

      FROM work_entries we
      JOIN employee_roles er ON we.employee_role_id = er.id_employee_role
      JOIN roles r ON er.role_id = r.id_role
      JOIN books b ON we.book_id = b.id_book

      LEFT JOIN employees e_pm ON e_pm.clickup_id = b.project_manager_clickup_id
      LEFT JOIN users u_pm ON e_pm.user_id = u_pm.id_user

      WHERE er.employee_id = ?
        AND MONTH(we.date) = ?
        AND YEAR(we.date) = ?
    `;

    const rows = await executeQuery(sql, [employeeId, month, year]);

    for (const row of rows) {
      if (!row.project_manager_name && row.project_manager_clickup_id) {
        try {
          row.project_manager_name = await getProjectManagerNameById(row.project_manager_clickup_id);
        } catch (error) {
          console.error('שגיאה בשליפת שם מנהל מפרויקט:');
          row.project_manager_name = 'שגיאה בשליפה';
        }
      }
    }

    return rows;
  }


  async summarizeWorkEntriesByBook(workEntries) {
    const summary = {};

    for (const entry of workEntries) {
      const bookId = entry.book_id;
      const AZ_book_id = entry.AZ_book_id;
      const bookName = entry.book_name;
      const isSpecial = entry.is_special_work === 1;
      const unit = entry.special_unit || 'unit';
      const rate = parseFloat(entry.applied_rate);
      const rateKey = rate.toFixed(2);
      let projectManagerName = entry.project_manager_name;

      if (!projectManagerName && entry.project_manager_clickup_id) {
        try {
          const clickUpUser = await clickUpService.getUserById(entry.project_manager_clickup_id);
          projectManagerName = clickUpUser?.username || clickUpUser?.name || 'מנהל לא ידוע';
        } catch (error) {
          console.error('שגיאה בשליפת מנהל מפרויקט מ-ClickUp:');
          projectManagerName = 'שגיאה בשליפה';
        }
      }

      const key = isSpecial
        ? `${bookId}_special_${unit}_${rateKey}`
        : `${bookId}_hours_${rateKey}`;

      if (!summary[key]) {
        summary[key] = {
          AZ_book_id,
          book_name: bookName,
          quantity: 0,
          rate,
          type: isSpecial ? 'special' : 'hours',
          unit: isSpecial ? unit : null,
          projectManagerName
        };
      }

      summary[key].quantity += parseFloat(entry.quantity);
    }

    const result = Object.values(summary).map(entry => ({
      AZ_book_id: entry.AZ_book_id,
      book_name: entry.book_name,
      type: entry.type,
      unit: entry.unit,
      quantity: entry.quantity,
      rate: entry.rate,
      total: +(entry.quantity * entry.rate).toFixed(2),
      projectManagerName: entry.projectManagerName
    }));

    return result;
  }
}