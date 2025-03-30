// services/roleService.js
import executeQuery from '../config/db.js';

export class RoleService {
    static table = "roles";

    // שליפת כל התפקידים
    async getAllRoles() {
        const query = `SELECT * FROM ${RoleService.table}`;
        const roles = await executeQuery(query);
        return roles;
    }

    // יצירת תפקיד חדש
    async createRole(name) {
        const query = `INSERT INTO ${RoleService.table} (name) VALUES (?)`;
        const result = await executeQuery(query, [name]);
        return { id_roles: result.insertId, name };
    }
}
