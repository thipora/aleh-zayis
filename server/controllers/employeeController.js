// import employeeService from '../services/employeeService';

// export class EmployeeController {
//     // הוספת עובד חדש
//     async addEmployee(req, res, next) {
//         try {
//             const { name, email, role } = req.body; // פרטי העובד החדש

//             // הוספת העובד
//             const newEmployee = await employeeService.addEmployee({ name, email, role });

//             // שליחה של תגובה עם העובד החדש
//             res.status(201).json(newEmployee);
//         } catch (error) {
//             next({
//                 statusCode: error.statusCode || 500,
//                 message: error.message || 'Error adding employee'
//             });
//         }
//     }

//     // שליפת כל העובדים
//     async getAllEmployees(req, res, next) {
//         try {
//             const employees = await employeeService.getAllEmployees();
//             res.json(employees);
//         } catch (error) {
//             next({
//                 statusCode: error.statusCode || 500,
//                 message: error.message || 'Error fetching employees'
//             });
//         }
//     }
// }

import { EmployeeService } from '../services/employeesService.js';

export class EmployeeController {
    
    static employeeService = new EmployeeService();


    async getAllEmployees(req, res, next) {
      try {
          const employees = await EmployeeController.employeeService.getAllEmployees(); // קריאה לשירות לשליפת העובדים
          res.status(200).json(employees); // החזרת הרשימה
      } catch (error) {
          next({
              statusCode: error.statusCode || 500,
              message: error.message || 'Error fetching employees'
          });
      }
  }


    // יצירת עובד + משתמש
    async createEmployee(req, res, next) {
        try {
            const { name, email, role } = req.body;  // פרטי העובד

            // קריאה לשירות של העובד
            const employee = await EmployeeController.employeeService.createEmployee({ name, email, role });

            // שליחה של התשובה עם פרטי העובד
            res.status(201).json(employee);
        } catch (error) {
            next({
                statusCode: error.statusCode || 500,
                message: error.message || 'Error creating employee'
            });
        }
    }
}
