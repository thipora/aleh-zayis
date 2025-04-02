// routes/roleRoutes.js
import express from 'express';
import { RoleController } from '../controllers/roleController.js';

const router = express.Router();

// קריאת API לקבלת כל התפקידים
router.get('/', RoleController.prototype.getRoles);

// יצירת תפקיד חדש
router.post('/', RoleController.prototype.createRole);

router.get('/:employeeId/payment-types', RoleController.prototype.getPaymentTypes);

export default router;
