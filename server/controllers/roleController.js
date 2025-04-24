// controllers/roleController.js
import { RoleService } from '../services/roleService.js';

export class RoleController {
    static roleService = new RoleService();

    // שליפת כל התפקידים
    async getRoles(req, res, next) {
        try {
            const roles = await RoleController.roleService.getAllRoles();
            res.json(roles);
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


    async getPaymentTypes(req, res, next) {
        try {
            const { employeeId } = req.params;
            const data = await RoleController.roleService.getPaymentTypes(employeeId);

            return res.json({ data });
        } catch (ex) {
            next({
                statusCode: ex.errno || 500,
                message: ex.message || ex
            });
        }
    }
}
