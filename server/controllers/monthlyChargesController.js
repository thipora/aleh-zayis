import { MonthlyChargesService } from "../services/monthlyChargesService.js";

export class MonthlyChargesController {
    static monthlyChargesService = new MonthlyChargesService();

    async getChargesByEmployee(req, res, next) {
        try {
            const { employeeId } = req.params;
            const charges = await MonthlyChargesController.monthlyChargesService.getChargesByEmployee(employeeId);
            res.json(charges);
        } catch (err) {
            next({
                statusCode: 500,
                message: err.message || "Failed to fetch monthly charges"
            });
        }
    }

    async addCharge(req, res, next) {
        try {
            const { employee_id, charge_name, amount, notes } = req.body;
            await MonthlyChargesController.monthlyChargesService.addCharge(employee_id, charge_name, amount, notes);
            res.status(200).json({ message: "Charge added successfully" });
        } catch (err) {
            next({
                statusCode: 500,
                message: err.message || "Failed to add monthly charge"
            });
        }
    }

    async deleteCharge(req, res, next) {
        try {
            const { chargeId } = req.params;
            await MonthlyChargesController.monthlyChargesService.deleteCharge(chargeId);
            res.status(200).json({ message: "Charge deleted" }); // ✅ במקום sendStatus
        } catch (err) {
            next({ statusCode: 500, message: err.message || "Failed to delete" });
        }
    }

}
