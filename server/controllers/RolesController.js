// import { RolesService } from '../services/rolesService.js';

// export class RolesController {
//   static rolesService = new RolesService();

//   async getRoleById(req, res, next) {
//     try {
//       const { roleId } = req.params;
//       const role = await RolesController.rolesService.getRoleById(roleId);
//       if (!role) {
//         return res.status(404).json({ message: 'Role not found' });
//       }
//       res.json(role);
//     } catch (err) {
//       next(err);
//     }
//   }
// }

import { RolesService } from '../services/rolesService.js';

export class RolesController {
  static rolesService = new RolesService();

  async getRoleById(req, res, next) {
    try {
      const { roleId } = req.params;
      const role = await RolesController.rolesService.getRoleById(roleId);
      if (!role) {
        return res.status(404).json({ message: 'Role not found' });
      }
      res.json(role);
    } catch (err) {
      next(err);
    }
  }

  async getRolesByIds(req, res, next) {
    try {
      const idsParam = req.query.ids; // מחרוזת "1,2,3"
      if (!idsParam) {
        return res.status(400).json({ message: 'Missing ids query parameter' });
      }

      const ids = idsParam.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id));
      const roles = await RolesController.rolesService.getRolesByIds(ids);
      res.json(roles);
    } catch (err) {
      next(err);
    }
  }
}
