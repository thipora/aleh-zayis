import executeQuery from '../config/db.js';
import bcrypt from 'bcrypt';
import { UserService } from './userService.js'; // Import the UserService
import { fetchClickUpAPI } from '../config/clickUpApiConfig.js';

export class EmployeeService {

    async getAllEmployees() {
        const query = 'SELECT emplors.email, roles.name AS role FROM alehzayis.employees JOIN alehzayis.users ON employees.user_id = users.id_user JOIN alehzayis.roles ON employees.role_id = roles.id_role';
        const result = await executeQuery(query);
        return result;
    }


    // // יצירת עובד חדש + משתמש
    // async createEmployee(params) {
    //     const { name, email, role_id } = params;

    //     // 1. יצירת סיסמא אקראית
    //     const rawPassword = this.generateRandomPassword();

    //     // 2. הצפנת הסיסמא
    //     const hashedPassword = await bcrypt.hash(rawPassword, 10);

    //     // 3. יצירת משתמש בטבלת users
    //     const userService = new UserService();
    //     const userId = await userService.addUser({
    //         name,
    //         email,
    //         password: hashedPassword,
    //         account_type: 'employee'
    //     });

    //     if (!userId) {
    //         throw new Error('Failed to create user');
    //     }

    //     // 4. יצירת עובד בטבלת employees
    //     const employeeQuery = `INSERT INTO alehzayis.employees (user_id, role_id) VALUES (?, ?)`;
    //     const result = await executeQuery(employeeQuery, [userId, role_id]);

    //     if (!result.insertId) {
    //         throw new Error('Failed to create employee');
    //     }

    //     // 5. שליחת המייל עם הסיסמא לעובד החדש
    //     await sendMail({
    //         to: email,
    //         subject: 'Welcome to Aleh Zayis Website!',
    //         html: `
    //             <h2>Welcome to Aleh Zayis!</h2>
    //             <p>Your account has been successfully created. Here is your login password:</p>
    //             <p><strong>Password:</strong> ${rawPassword}</p>
    //         `
    //     });

    //     return { id: result.insertId, userId, role_id };
    // }


        // יצירת עובד חדש + משתמש
        async createEmployee(params) {


            // 4. יצירת עובד בטבלת employees
            const employeeQuery = `INSERT INTO alehzayis.employees (user_id, clickup_id) VALUES (?, ?)`;
            const result = await executeQuery(employeeQuery, [params.user_id, params.clickup_id]);
    
            if (!result.insertId) {
                throw new Error('Failed to create employee');
            }
    
            return result.insertId;
        }


    async getEmployeeIdByUserId(userId) {
        const query = 'SELECT id_employee FROM alehZayis.employees WHERE user_id = ?';
        const result = await executeQuery(query, [userId]);
        return result.length > 0 ? result[0] : null; // אם יש תוצאה, מחזירים את ה-employeeId, אחרת null
    }



    async getClickUpEmployees(teamId) {
        const data = await fetchClickUpAPI(`https://api.clickup.com/api/v2/team/${teamId}/user`);
        if (data) {
            console.log(data);  // הדפסת הנתונים לקבלת כל העובדים
            return data.users;  // מחזירים את רשימת העובדים
        }
        return [];  // במקרה ואין נתונים
    }
    

}
