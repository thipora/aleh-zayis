// services/reportsService.js
import { executeQuery } from "../config/db.js";

export class ReportsService {
  async getBookSummary(bookId) {
//     const sql = `
//       SELECT
//   e.id_employee,
//   u.name AS employee_name,
//   r.role_name,
//   COALESCE(SUM(we.quantity), 0) AS total_quantity,
//   e.rate,
//   COALESCE(SUM(we.quantity), 0) * e.rate AS total_payment
// FROM employees e
// JOIN users u ON e.user_id = u.id_user
// JOIN employee_roles er ON e.id_employee = er.employee_id
// JOIN roles r ON er.role_id = r.id_role
// LEFT JOIN work_entries we ON e.id_employee = we.employee_id AND we.book_id = ?
// GROUP BY e.id_employee, u.name, r.role_name, e.rate
// ORDER BY r.role_name, u.name;
//     `;

//     return await executeQuery(sql, [bookId]);


const sql = `
SELECT 
  e.id_employee,
  u.name AS employee_name,
  r.role_name,
  we.start_time,
  we.end_time
  COALESCE(SUM(we.quantity), 0) * e.rate AS total_payment
FROM work_entries we
JOIN employees e ON we.employee_id = e.id_employee
JOIN users u ON e.user_id = u.id_user
JOIN employee_roles er ON e.id_employee = er.employee_id
JOIN roles r ON er.role_id = r.id_role
WHERE we.book_id = ?
GROUP BY e.id_employee, u.name, r.role_name, e.rate
ORDER BY u.name
`;

const rows = await executeQuery(sql, [bookId]);

// עיבוד לפורמט pivot לפי תפקידים
const grouped = {};
for (const row of rows) {
if (!grouped[row.id_employee]) {
  grouped[row.id_employee] = {
    employee_id: row.id_employee,
    employee_name: row.employee_name,
    roles: {}
  };
}
grouped[row.id_employee].roles[row.role_name] = row.total_quantity * row.rate;
}

return Object.values(grouped);
}

  }
