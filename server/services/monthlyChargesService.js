import { executeQuery } from "../config/db.js";

export class MonthlyChargesService {
    async getChargesByEmployee(employeeId) {
        const sql = `
      SELECT id_monthly_charges, charge_name, amount, notes
      FROM monthly_charges
      WHERE employee_id = ?
      ORDER BY id_monthly_charges DESC
    `;
        return await executeQuery(sql, [employeeId]);
    }

    async addCharge(employee_id, charge_name, amount, notes) {
        const sql = `
      INSERT INTO monthly_charges (employee_id, charge_name, amount, notes)
      VALUES (?, ?, ?, ?)
    `;
        return await executeQuery(sql, [employee_id, charge_name, amount, notes]);
    }
    
    async deleteCharge(id) {
        const sql = `DELETE FROM monthly_charges WHERE id_monthly_charges = ?`;
        return await executeQuery(sql, [id]);
    }

}
