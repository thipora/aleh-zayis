import express from 'express';
import {
  getAllEmployeeRoles,
  updateRatesForEmployeeRole,
  getEmployeeRolesById,
  updateMultipleRatesForEmployeeRole
} from '../controllers/employeeRolesController.js';

const router = express.Router();

router.get('/', getAllEmployeeRoles);
router.get('/:id', getEmployeeRolesById);
router.post('/', updateMultipleRatesForEmployeeRole);
router.put('/:id/rates', updateRatesForEmployeeRole);

export default router;