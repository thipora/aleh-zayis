// import { executeQuery } from '../config/db.js';

// export class RolesService {
//   async getRoleById(roleId) {
//     const query = `
//       SELECT id_role, role_name, uses_special_quantity, special_unit
//       FROM alehZayis.roles
//       WHERE id_role = ?
//     `;
//     const result = await executeQuery(query, [roleId]);
//     return result[0] || null;
//   }
// }
import { executeQuery } from '../config/db.js';

export class RolesService {
  async getRoleById(roleId) {
    const query = `
      SELECT id_role, role_name, uses_special_quantity, special_unit
      FROM alehZayis.roles
      WHERE id_role = ?
    `;
    const result = await executeQuery(query, [roleId]);
    return result[0] || null;
  }

  async getRolesByIds(ids) {
    if (!ids.length) return [];

    const placeholders = ids.map(() => '?').join(', ');
    const query = `
      SELECT id_role, role_name, uses_special_quantity, special_unit
      FROM alehZayis.roles
      WHERE id_role IN (${placeholders})
    `;
    const result = await executeQuery(query, ids);
    return result;
  }
}
