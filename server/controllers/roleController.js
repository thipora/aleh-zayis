// controllers/roleController.js
import { RoleService } from '../services/roleService.js';

export class RoleController {
    static roleService = new RoleService();

    // שליפת כל התפקידים
    async getRoles(req, res, next) {
        try {
            const roles = await RoleController.roleService.getAllRoles();
            return res.json(roles);
        } catch (ex) {
            next({
                statusCode: ex.errno || 500,
                message: ex.message || ex
            });
        }
    }

    // יצירת תפקיד חדש
    async createRole(req, res, next) {
        try {
            const { name } = req.body;  // שם התפקיד החדש
            const newRole = await RoleController.roleService.createRole(name);
            return res.status(201).json(newRole);
        } catch (ex) {
            next({
                statusCode: ex.errno || 500,
                message: ex.message || ex
            });
        }
    }


    async checkSpecialPaymentType(req, res, next) {
        try {
            const { employeeId } = req.params;
            const canAssignSpecialWork = await RoleController.roleService.checkSpecialPaymentType(employeeId);

            return res.json({ canAssignSpecialWork });
        } catch (ex) {
            next({
                statusCode: ex.errno || 500,
                message: ex.message || ex
            });
        }
    }
}
