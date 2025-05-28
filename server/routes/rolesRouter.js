import express from 'express';
import { RolesController } from '../controllers/rolesController.js';
import { verifyToken } from "../middleware/authenticateToken.js";

const router = express.Router();
const rolesController = new RolesController();

router.get('/:roleId', verifyToken, rolesController.getRoleById);
router.get('/', verifyToken, rolesController.getRolesByIds);
router.get('/names', verifyToken, rolesController.getRoleNamesByIds);


export default router;
