import express from 'express';
import {
  getAllEmployeeRoles,
  updateRatesForEmployeeRole,
} from '../controllers/employeeRolesController.js';

const router = express.Router();

router.get('/', getAllEmployeeRoles);
router.put('/:id/rates', updateRatesForEmployeeRole);

export default router;