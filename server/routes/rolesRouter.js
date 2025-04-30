// import express from 'express';
// import { RolesController } from '../controllers/RolesController.js';

// const router = express.Router();
// const rolesController = new RolesController();

// router.get('/:roleId', rolesController.getRoleById);

// export default router;

import express from 'express';
import { RolesController } from '../controllers/rolesController.js';

const router = express.Router();
const rolesController = new RolesController();

router.get('/:roleId', rolesController.getRoleById); // שמור קיים
router.get('/', rolesController.getRolesByIds);      // חדש – תמיכה ב-?ids=1,2,3

export default router;
