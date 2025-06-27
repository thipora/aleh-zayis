import { executeQuery } from "../config/db.js";
import { getProjectManagerNameById } from './projectManagerService.js'
import ExcelJS from 'exceljs';

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
      COALESCE(u.en_name, u.name) AS employee_name,
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

  async generateAllWorkExcel() {
    const rows = await ReportsService.getAllWorkEntriesWithDetails();
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("All Work Entries");
    worksheet.views = [{ rightToLeft: false }];

    worksheet.columns = [
            { header: "Employee", key: "employee_name", width: 25 },
      { header: "Role", key: "role_name", width: 20 },
      { header: "Book", key: "AZ_book_id", width: 30 },
      { header: "Date", key: "date", width: 15 },
      { header: "Start Time", key: "start_time", width: 12 },
      { header: "End Time", key: "end_time", width: 12 },
      { header: "Quantity", key: "quantity", width: 20 },
      { header: "Rate", key: "rate", width: 10 },
      { header: "Currency", key: "currency", width: 10 },
      { header: "Total", key: "total", width: 12 },
      { header: "Description", key: "description", width: 40 }
    ];

    rows.forEach(row => {
      const rate = row.applied_rate || (row.is_special_work ? row.special_rate : row.hourly_rate);
      const total = Number(row.quantity) * Number(rate || 0);

      let quantityFormatted = row.quantity;
      if (!row.special_unit) {
        const hours = Math.floor(row.quantity);
        const minutes = Math.round((row.quantity - hours) * 60);
        quantityFormatted = `${hours}h ${minutes}m`;
      } else {
        quantityFormatted = Number(row.quantity).toLocaleString('en-US', {
          maximumFractionDigits: 2,
          minimumFractionDigits: 0
        });
      }

      const rateFormatted = Number(rate).toLocaleString('en-US', {
        maximumFractionDigits: 2,
        minimumFractionDigits: 0
      });

      worksheet.addRow({
        employee_name: row.employee_name,
        role_name: row.role_name,
        AZ_book_id: row.AZ_book_id,
        date: row.date?.toISOString().split("T")[0],
        start_time: row.start_time?.slice(0, 5) || "",
        end_time: row.end_time?.slice(0, 5) || "",
        quantity: quantityFormatted,
        rate: rateFormatted,
        currency: row.currency,
        total: total.toLocaleString('en-US', {
          maximumFractionDigits: 2,
          minimumFractionDigits: 0
        }),
        description: row.description || ""
      });
    });

    return await workbook.xlsx.writeBuffer();
  }


  static async getAllWorkEntriesWithDetails() {
    const query = `
      SELECT
        u.name AS employee_name,
        r.role_name,
        r.special_unit,
        e.currency,
        b.AZ_book_id,
        we.date,
        we.start_time,
        we.end_time,
        we.quantity,
        we.description,
        we.applied_rate,
        we.is_special_work,
        er.hourly_rate,
        er.special_rate
      FROM work_entries we
      JOIN employee_roles er ON we.employee_role_id = er.id_employee_role
      JOIN employees e ON er.employee_id = e.id_employee
      JOIN users u ON e.user_id = u.id_user
      JOIN roles r ON er.role_id = r.id_role
      JOIN books b ON we.book_id = b.id_book
      ORDER BY we.date DESC
    `;
    return await executeQuery(query);
  }

}
