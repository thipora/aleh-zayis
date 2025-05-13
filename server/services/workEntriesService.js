import { executeQuery } from '../config/db.js';
// import { calculateWorkQuantityFromTimes } from '../utils/timeUtils.js';
import { calculateWorkQuantityFromTimes } from '../util/timeUtils.js'

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
    `;

    // LIMIT ?, ?



    // values.push(start, range);
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
    let is_special_work = true;
    if (quantity == 0) {
      is_special_work = false;
      const calculated = calculateWorkQuantityFromTimes(start_time, end_time);
      if (calculated) quantity = calculated;
    }
    const query = `
      INSERT INTO ${WorkEntriesService.table}
      (employee_role_id, date, quantity, description, notes, book_id, start_time, end_time, is_special_work)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [employeeRoleId, date, quantity, description, notes, book_id, start_time, end_time, is_special_work];
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
    const workEntries = await this.getMonthlyWorkEntriesWithDetails(month, year);
    return this.summarizeWorkEntriesWithRates(workEntries);
  }

  async getMonthlyWorkEntriesWithDetails(month, year) {
    const sql = `
SELECT
  we.employee_role_id,
  we.quantity,
  we.is_special_work,
  e.id_employee,
  u.name AS employee_name,
  u.email AS employee_email,
  er.hourly_rate,
  er.special_rate,
  r.special_unit
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
      const unit = entry.special_unit || 'unit';

      if (!summary[empId]) {
        summary[empId] = {
          employee_id: empId,
          employee_name: name,
          employee_email: email,
          hours: 0,
          hourly_rate: entry.hourly_rate || 0,
          specials: {} // { "תווים": { quantity, rate } }
        };
      }

      if (isSpecial) {
        if (!summary[empId].specials[unit]) {
          summary[empId].specials[unit] = {
            quantity: 0,
            rate: entry.special_rate || 0
          };
        }
        summary[empId].specials[unit].quantity += parseFloat(entry.quantity);
      } else {
        summary[empId].hours += parseFloat(entry.quantity);
      }
    }

    // הפיכת המידע לפלט מפורט
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
          total: +(emp.hours * emp.hourly_rate).toFixed(2)
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
          total: +(data.quantity * data.rate).toFixed(2)
        });
      });
    });

    return result;
  }



  // async getMonthlySummaryByEmployee(employeeId, { month, year }) {
  //   const sql = `
  //     SELECT
  //       b.id_book,
  //       b.name AS book_name,
  //       SUM(we.quantity) AS quantity
  //     FROM work_entries we
  //     JOIN employee_roles er ON we.employee_role_id = er.id_employee_role
  //     JOIN employees e ON er.employee_id = e.id_employee
  //     JOIN books b ON we.book_id = b.id_book
  //     WHERE e.id_employee = ?
  //       AND MONTH(we.date) = ?
  //       AND YEAR(we.date) = ?
  //     GROUP BY b.id_book, b.name
  //     ORDER BY b.name
  //   `;
  //   return await executeQuery(sql, [employeeId, month, year]);
  // }
  async getMonthlySummaryByEmployee(employeeId, { month, year }) {
    const workEntries = await this.getWorkEntriesByEmployeeId(employeeId, month, year);
    const summary = this.summarizeWorkEntriesByBook(workEntries);
    return summary;
  }

  async getWorkEntriesByEmployeeId(employeeId, month, year) {
    const sql = `
    SELECT
      we.quantity,
      we.is_special_work,
      we.book_id,
      b.name AS book_name,
      b.AZ_book_id,
      er.hourly_rate,
      er.special_rate,
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

    return await executeQuery(sql, [employeeId, month, year]);
  }



  async summarizeWorkEntriesByBook(workEntries) {
    const summary = {};

    for (const entry of workEntries) {
      const bookId = entry.book_id;
      const AZ_book_id = entry.AZ_book_id
      const bookName = entry.book_name;
      const isSpecial = entry.is_special_work === 1;
      const unit = entry.special_unit || 'unit';

      if (!summary[bookId]) {
        let projectManagerName = entry.project_manager_name;

        if (!projectManagerName && entry.project_manager_clickup_id) {
          try {
            const clickUpUser = await clickUpService.getUserById(entry.project_manager_clickup_id);
            projectManagerName = clickUpUser?.username || clickUpUser?.name || 'מנהל לא ידוע';
          } catch (err) {
            console.error('שגיאה בשליפת מנהל מפרויקט מ-ClickUp:', err.message);
            projectManagerName = 'שגיאה בשליפה';
          }
        }


        summary[bookId] = {
          AZ_book_id: AZ_book_id,
          book_name: bookName,
          hours: 0,
          hourly_rate: entry.hourly_rate || 0,
          specials: {} // למשל: { "תווים": { quantity, rate } }
        };
      }

      if (isSpecial) {
        if (!summary[bookId].specials[unit]) {
          summary[bookId].specials[unit] = {
            quantity: 0,
            rate: entry.special_rate || 0
          };
        }
        summary[bookId].specials[unit].quantity += parseFloat(entry.quantity);
      } else {
        summary[bookId].hours += parseFloat(entry.quantity);
      }
    }

    // הפקת פלט של רשימות לפי ספר
    const result = [];

    Object.values(summary).forEach(book => {
      if (book.hours > 0) {
        result.push({
          AZ_book_id: book.AZ_book_id,
          book_name: book.book_name,
          type: 'hours',
          quantity: book.hours,
          rate: book.hourly_rate,
          total: +(book.hours * book.hourly_rate).toFixed(2)
        });
      }

      Object.entries(book.specials).forEach(([unit, data]) => {
        result.push({
          AZ_book_id: book.AZ_book_id,
          book_name: book.book_name,
          type: 'special',
          unit,
          quantity: data.quantity,
          rate: data.rate,
          total: +(data.quantity * data.rate).toFixed(2)
        });
      });
    });

    return result;
  }


}
