import { sendMail } from './MailService.js';
import executeQuery from '../config/db.js';
import bcrypt from 'bcrypt';
import { UserService } from './userService.js'; // Import the UserService

export class EmployeeService {

    async getAllEmployees() {
        const query = 'SELECT employees.id_employee, users.name, users.email, roles.name AS role FROM alehzayis.employees JOIN alehzayis.users ON employees.user_id = users.id_user JOIN alehzayis.roles ON employees.role = roles.id_role';
        const result = await executeQuery(query);
        return result;
    }

    // יצירת סיסמא אקראית
    generateRandomPassword() {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let password = '';
        for (let i = 0; i < 6; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            password += characters[randomIndex];
        }
        return password;
    }

    // יצירת עובד חדש + משתמש
    async createEmployee(params) {
        const { name, email, role } = params;

        // 1. יצירת סיסמא אקראית
        const rawPassword = this.generateRandomPassword();

        // 2. הצפנת הסיסמא
        const hashedPassword = await bcrypt.hash(rawPassword, 10);

        // 3. יצירת משתמש בטבלת users
        const userService = new UserService();
        const userId = await userService.addUser({
            name,
            email,
            password: hashedPassword,
            account_type: 'employee'
        });

        if (!userId) {
            throw new Error('Failed to create user');
        }

        // 4. יצירת עובד בטבלת employees
        const employeeQuery = `INSERT INTO alehzayis.employees (user_id, role) VALUES (?, ?)`;
        const result = await executeQuery(employeeQuery, [userId, role]);

        if (!result.insertId) {
            throw new Error('Failed to create employee');
        }

        // 5. שליחת המייל עם הסיסמא לעובד החדש
        await sendMail({
            to: email,
            subject: 'Welcome to Aleh Zayis Website!',
            html: `
                <h2>Welcome to Aleh Zayis!</h2>
                <p>Your account has been successfully created. Here is your login password:</p>
                <p><strong>Password:</strong> ${rawPassword}</p>
            `
        });
            
        return { id: result.insertId, userId, role };
    }
}
