import { executeQuery } from '../config/db.js';
// import { calculateWorkQuantityFromTimes } from '../utils/timeUtils.js';
import { calculateWorkQuantityFromTimes } from '../util/timeUtils.js'

export class WorkEntriesService {
  static table = "work_entries";

  async getWorkEntriesByEmployee(employeeId, { month, year, projectId, sort = 'date DESC', start = 0, range = 10 } = {}) {
    const conditions = ['er.employee_id = ?'];
    const values = [employeeId];

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
        r.role_name
      FROM work_entries we
      JOIN employee_roles er ON we.employee_role_id = er.id_employee_role
      JOIN employees e ON er.employee_id = e.id_employee
      JOIN roles r ON er.role_id = r.id_role
      JOIN books b ON we.book_id = b.id_book
      WHERE ${conditions.join(' AND ')}
      ORDER BY ${sort}
      LIMIT ?, ?
    `;

    values.push(start, range);
    return await executeQuery(query, values);
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


  // async createWorkEntry(employeeId, { roleId, date, quantity, description, notes, book_id, start_time, end_time }) {

  //   if (!quantity && start_time && end_time) {
  //     const start = dayjs(`2000-01-01T${start_time}`);
  //     const end = dayjs(`2000-01-01T${end_time}`);
  //     const diffInMinutes = end.diff(start, 'minute');

  //     if (diffInMinutes > 0) {
  //       quantity = (diffInMinutes / 60).toFixed(3); // שעות מדויקות
  //     }
  //   }

  //   const query = `
  //     INSERT INTO ${WorkEntriesService.table}
  //     (employee_role_id, date, quantity, description, notes, book_id, start_time, end_time)
  //     VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  //   `;
  //   const values = [employeeRoleId, date, quantity, description, notes, book_id, start_time, end_time];
  //   const result = await executeQuery(query, values);
  //   return {
  //     id_work_entries: result.insertId,
  //     employee_role_id: employeeRoleId,
  //     date, quantity, description, notes, book_id, start_time, end_time
  //   };
  // }

  async createWorkEntry(employeeId, { roleId, date, quantity, description, notes, book_id, start_time, end_time }) {
    const [empRole] = await executeQuery(
      'SELECT id_employee_role FROM employee_roles WHERE employee_id = ? AND role_id = ?',
      [employeeId, roleId]
    );
    if (!empRole) {
      throw new Error('Employee role not found');
    }
    const employeeRoleId = empRole.id_employee_role;
    if (quantity == 0) {
      const calculated = calculateWorkQuantityFromTimes(start_time, end_time);
      if (calculated) quantity = calculated;
    }
    const query = `
      INSERT INTO ${WorkEntriesService.table}
      (employee_role_id, date, quantity, description, notes, book_id, start_time, end_time)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [employeeRoleId, date, quantity, description, notes, book_id, start_time, end_time];
    const result = await executeQuery(query, values);
    return {
      id_work_entries: result.insertId,
      employee_role_id: employeeRoleId,
      date, quantity, description, notes, book_id, start_time, end_time
    };
  }


  async getEditorWorkByMonth(employeeId, { month, year }) {
    const sql = `
      SELECT
        we.date,
        we.quantity,
        we.description,
        we.notes,
        we.start_time,
        we.end_time,
        b.name AS book_name,
        b.clickup_id,
        r.role_name
      FROM work_entries we
      JOIN employee_roles er ON we.employee_role_id = er.id_employee_role
      JOIN employees e ON er.employee_id = e.id_employee
      JOIN books b ON we.book_id = b.id_book
      JOIN roles r ON er.role_id = r.id_role
      WHERE e.id_employee = ?
        AND MONTH(we.date) = ?
        AND YEAR(we.date) = ?
      ORDER BY b.name, we.date
    `;
    return await executeQuery(sql, [employeeId, month, year]);
  }

  async getProjectWorkByMonth(bookId, { month, year }) {
    const sql = `
      SELECT 
        u.name AS editor_name,
        we.date,
        we.quantity,
        we.description,
        we.notes,
        we.start_time,
        we.end_time
      FROM work_entries we
      JOIN employee_roles er ON we.employee_role_id = er.id_employee_role
      JOIN employees e ON er.employee_id = e.id_employee
      JOIN users u ON e.user_id = u.id_user
      WHERE we.book_id = ?
        AND YEAR(we.date) = ?
        AND MONTH(we.date) = ?
      ORDER BY editor_name, we.date
    `;
    return await executeQuery(sql, [bookId, year, month]);
  }

  async getEditorsSummaryByMonth({ month, year }) {
    const sql = `
      SELECT 
        u.name AS editor_name,
        e.id_employee AS editor_id,
        SUM(we.quantity) AS total_hours
      FROM work_entries we
      JOIN employee_roles er ON we.employee_role_id = er.id_employee_role
      JOIN employees e ON er.employee_id = e.id_employee
      JOIN users u ON e.user_id = u.id_user
      WHERE YEAR(we.date) = ? AND MONTH(we.date) = ?
      GROUP BY e.id_employee, u.name
      ORDER BY total_hours DESC
    `;
    return await executeQuery(sql, [year, month]);
  }

  async getBooksSummary({ month, year } = {}) {
    const where = [];
    const params = [];

    if (month && year) {
      where.push('YEAR(we.date) = ?');
      where.push('MONTH(we.date) = ?');
      params.push(year, month);
    }

    const sql = `
      SELECT 
        b.id_book,
        b.name AS book_name,
        SUM(we.quantity) AS total_hours
      FROM work_entries we
      JOIN books b ON we.book_id = b.id_book
      ${where.length ? 'WHERE ' + where.join(' AND ') : ''}
      GROUP BY b.id_book, b.name
      ORDER BY total_hours DESC
    `;
    return await executeQuery(sql, params);
  }

  async getBookEmployeesSummary(bookId, { month, year } = {}) {
    const where = ['we.book_id = ?'];
    const params = [bookId];

    if (month && year) {
      where.push('YEAR(we.date) = ?');
      where.push('MONTH(we.date) = ?');
      params.push(year, month);
    }

    const sql = `
      SELECT 
        u.name AS employee_name,
        e.id_employee AS employee_id,
        SUM(we.quantity) AS total_hours
      FROM work_entries we
      JOIN employee_roles er ON we.employee_role_id = er.id_employee_role
      JOIN employees e ON er.employee_id = e.id_employee
      JOIN users u ON e.user_id = u.id_user
      WHERE ${where.join(' AND ')}
      GROUP BY e.id_employee, u.name
      ORDER BY total_hours DESC
    `;
    return await executeQuery(sql, params);
  }

  async getBookEmployeeDetails(bookId, employeeId, { month, year } = {}) {
    const where = ['we.book_id = ?', 'e.id_employee = ?'];
    const params = [bookId, employeeId];

    if (month && year) {
      where.push('YEAR(we.date) = ?');
      where.push('MONTH(we.date) = ?');
      params.push(year, month);
    }

    const sql = `
      SELECT
        we.date,
        we.quantity,
        we.description,
        we.notes
      FROM work_entries we
      JOIN employee_roles er ON we.employee_role_id = er.id_employee_role
      JOIN employees e ON er.employee_id = e.id_employee
      WHERE ${where.join(' AND ')}
      ORDER BY we.date
    `;
    return await executeQuery(sql, params);
  }

  async getMonthlyWorkSummaryByEmployees({ month, year }) {
    const sql = `
      SELECT
        e.id_employee,
        u.name AS employee_name,
        SUM(we.quantity) AS total_quantity
      FROM work_entries we
      JOIN employee_roles er ON we.employee_role_id = er.id_employee_role
      JOIN employees e ON er.employee_id = e.id_employee
      JOIN users u ON e.user_id = u.id_user
      WHERE MONTH(we.date) = ? AND YEAR(we.date) = ?
      GROUP BY e.id_employee, u.name
      ORDER BY total_quantity DESC
    `;
    return await executeQuery(sql, [month, year]);
  }

  async getMonthlySummaryByEmployee(employeeId, { month, year }) {
    const sql = `
      SELECT
        b.id_book,
        b.name AS book_name,
        SUM(we.quantity) AS quantity
      FROM work_entries we
      JOIN employee_roles er ON we.employee_role_id = er.id_employee_role
      JOIN employees e ON er.employee_id = e.id_employee
      JOIN books b ON we.book_id = b.id_book
      WHERE e.id_employee = ?
        AND MONTH(we.date) = ?
        AND YEAR(we.date) = ?
      GROUP BY b.id_book, b.name
      ORDER BY b.name
    `;
    return await executeQuery(sql, [employeeId, month, year]);
  }
}
