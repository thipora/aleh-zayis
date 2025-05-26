// import express from 'express';
// import { RolesController } from '../controllers/RolesController.js';

// const router = express.Router();
// const rolesController = new RolesController();

// router.get('/:roleId', rolesController.getRoleById);

// export default router;

import express from 'express';
import { RolesController } from '../controllers/rolesController.js';
import { verifyToken } from "../middleware/authenticateToken.js";

const router = express.Router();
const rolesController = new RolesController();

router.get('/:roleId', verifyToken, rolesController.getRoleById); // שמור קיים
router.get('/', verifyToken, rolesController.getRolesByIds);      // חדש – תמיכה ב-?ids=1,2,3
router.get('/names', verifyToken, rolesController.getRoleNamesByIds);


export default router;
