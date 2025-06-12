import { EmployeeService } from '../services/employeesService.js';

export class EmployeeController {

    static employeeService = new EmployeeService();

    async getAllEmployees(req, res, next) {
        try {
            const employees = await EmployeeController.employeeService.getAllEmployees();
            res.status(200).json(employees);
        } catch (error) {
            next({
                statusCode: error.statusCode || 500,
                message: error.message || 'Error fetching employees'
            });
        }
    }

    async createEmployee(req, res, next) {
        try {
            const { name, email, role } = req.body;

            const employee = await EmployeeController.employeeService.createEmployee({ name, email, role });

            res.status(201).json(employee);
        } catch (error) {
            next({
                statusCode: error.statusCode || 500,
                message: error.message || 'Error creating employee'
            });
        }
    }

    async putStatusAvailability(req, res, next) {
        try {
            const { employeeId } = req.params;
            const { availability_status } = req.body;

            const employee = await EmployeeController.employeeService.putStatusAvailability({ employeeId, availability_status });

            res.status(201).json(employee);
        } catch (error) {
            next({
                statusCode: error.statusCode || 500,
                message: error.message || 'Error creating employee'
            });
        }
    }

    async getEmployeeCurrency(req, res, next) {
        try {
            const employee = await EmployeeController.employeeService.getEmployeeCurrencyById(req.params.employeeId);
            if (!employee) {
                return res.status(404).json({ message: "Employee not found" });
            }
            res.status(200).json({ currency: employee.currency });
        } catch (error) {
            next({
                statusCode: error.statusCode || 500,
                message: error.message || 'Error fetching employee currency'
            });
        }
    }

    async putCurrency(req, res) {
        const { employeeId } = req.params;
        const { currency } = req.body;

        try {
            await EmployeeController.employeeService.updateCurrency(employeeId, currency);
            res.json({ message: "Employee currency updated successfully" });
        } catch (error) {
            console.error("Error updating employee currency:", error);
            res.status(500).json({ error: "Failed to update employee currency" });
        }
    }

}
