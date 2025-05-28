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
}
