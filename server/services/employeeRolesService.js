import {executeQuery} from '../config/db.js';


export const getAllEmployeeRolesWithRates = async () => {
  const query = `
    SELECT
      er.id_employee_role,
      u.name AS employee_name,
      r.role_name,
      r.special_unit,
      er.hourly_rate,
      er.special_rate
    FROM employee_roles er
    JOIN employees e ON er.employee_id = e.id_employee
    JOIN users u ON e.user_id = u.id_user
    JOIN roles r ON er.role_id = r.id_role
  `;
  return await executeQuery(query);
};

export const updateRates = async (id, hourlyRate, specialRate) => {
  const query = `
    UPDATE employee_roles
    SET hourly_rate = ?, special_rate = ?
    WHERE id_employee_role = ?
  `;
  await executeQuery(query, [hourlyRate, specialRate, id]);
};