// routes/monthlyChargesRouter.js
import express from "express";
import { MonthlyChargesController } from "../controllers/monthlyChargesController.js";
import { verifyToken } from "../middleware/authenticateToken.js";

const monthlyChargesRouter = express.Router();
const monthlyChargesController = new MonthlyChargesController();


// שימוש ב־static methods, אז אין צורך ב־bind
monthlyChargesRouter.get("/:employeeId", verifyToken, monthlyChargesController.getChargesByEmployee);
monthlyChargesRouter.post("/", verifyToken, monthlyChargesController.addCharge);
monthlyChargesRouter.delete("/:chargeId", verifyToken, monthlyChargesController.deleteCharge);

export default monthlyChargesRouter;