import { executeQuery, getDBConnection } from '../config/db.js';

export const getAllEmployeeRolesWithRates = async () => {
  const query = `
    SELECT
      er.id_employee_role,
      u.name AS employee_name,
      r.role_name,
      r.special_unit,
      er.hourly_rate,
      er.special_rate,
      e.id_employee AS employee_id,
      e.currency
    FROM employee_roles er
    JOIN employees e ON er.employee_id = e.id_employee
    JOIN users u ON e.user_id = u.id_user
    JOIN roles r ON er.role_id = r.id_role
  `;
  return await executeQuery(query);
};

export const getEmployeeRolesWithRatesById = async (employeeId) => {
  const rolesQuery = `
    SELECT 
      er.id_employee_role,
      r.role_name,
      r.special_unit,
      r.uses_special_quantity,
      r.is_hourly_primary,
      er.hourly_rate,
      er.special_rate,
      e.id_employee AS employee_id,
      e.currency
    FROM employee_roles er
    JOIN employees e ON er.employee_id = e.id_employee
    JOIN roles r ON er.role_id = r.id_role
    WHERE er.employee_id = ?
  `;
  const roles = await executeQuery(rolesQuery, [employeeId]);

  const employeeQuery = `
    SELECT currency
    FROM employees
    WHERE id_employee = ?
  `;

  const employeeData = await executeQuery(employeeQuery, [employeeId]);
  const currency = employeeData.length > 0 ? employeeData[0].currency : 'ILS';

  return {
    roles,
    currency
  };
};


export const updateRates = async (id, hourlyRate, specialRate) => {
  const query = `
    UPDATE employee_roles
    SET hourly_rate = ?, special_rate = ?
    WHERE id_employee_role = ?
  `;
  await executeQuery(query, [hourlyRate, specialRate, id]);
};

export const updateMultipleRates = async (roles) => {
  const connection = await getDBConnection();

  try {
    await connection.beginTransaction();
    const updates = [];

    for (const role of roles) {
      const result = await updateRateForRole(role, connection);
      updates.push(result);
    }

    await connection.commit();
    return updates;

  } catch (err) {
    await connection.rollback();
    throw err;
  } finally {
    connection.release();
  }
};

const updateRateForRole = async (role, connection) => {
  const { id_employee_role } = role;

  const [current] = await connection.execute(
    `SELECT hourly_rate, special_rate FROM employee_roles WHERE id_employee_role = ?`,
    [id_employee_role]
  );

  if (current.length, role) {
    await updateWorkEntriesIfFirstRate(role, current[0], connection);
  }

  return await updateRoleRates(role, connection);
};


const updateRoleRates = async (role, connection) => {
  const { hourly_rate, special_rate, id_employee_role } = role;

  return await connection.execute(
    `UPDATE employee_roles SET hourly_rate = ?, special_rate = ? WHERE id_employee_role = ?`,
    [hourly_rate ?? 0.00, special_rate ?? 0.00, id_employee_role]
  );
};

const updateWorkEntriesIfFirstRate = async (role, currentRates, connection) => {
  const { hourly_rate, special_rate, id_employee_role } = role;

  if (parseFloat(currentRates.hourly_rate) === 0 && parseFloat(hourly_rate) > 0) {
    await connection.execute(
      `UPDATE work_entries SET applied_rate = ? WHERE employee_role_id = ? AND is_special_work = 0`,
      [hourly_rate, id_employee_role]
    );
  }

  if (parseFloat(currentRates.special_rate) === 0 && parseFloat(special_rate) > 0) {
    await connection.execute(
      `UPDATE work_entries SET applied_rate = ? WHERE employee_role_id = ? AND is_special_work = 1`,
      [special_rate, id_employee_role]
    );
  }
};
