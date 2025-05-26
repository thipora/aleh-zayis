import express from 'express';
import {
  getAllEmployeeRoles,
  updateRatesForEmployeeRole,
  getEmployeeRolesById,
  updateMultipleRatesForEmployeeRole
} from '../controllers/employeeRolesController.js';
import { verifyToken } from "../middleware/authenticateToken.js";

const router = express.Router();

router.get('/', verifyToken, getAllEmployeeRoles);
router.get('/:id', verifyToken, getEmployeeRolesById);
router.post('/', verifyToken, updateMultipleRatesForEmployeeRole);
router.put('/:id/rates', verifyToken, updateRatesForEmployeeRole);

export default router;