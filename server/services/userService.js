import bcrypt from 'bcrypt';
import { executeQuery } from '../config/db.js';
import { loginUserQuery, registerUserQuery } from '../queries/userQueries.js';
import { GeneryQuery } from "../queries/generyQueries.js";
import { EmployeeService } from "./employeesService.js";
import { findUserByEmailInClickUp } from './clickup/clickupEmployeeService.js';
import { sendMail } from '../util/mailer.js';
import { welcomeEmailTemplate } from '../util/emailTemplates.js';
// import { generateRandomPassword } from "../utils/passwordUtils.js";
import { generateRandomPassword } from "../util/passwordUtils.js";


export class UserService {
    static table = "users";
    static EmployeeService = new EmployeeService();

    async loginUser(params) {
        const query = loginUserQuery();
        const { email, password } = params;
        const users = await executeQuery(query, [email]);

        if (!users || users.length === 0) {
            throw new Error("Invalid email or password");
        }

        const isMatch = await bcrypt.compare(password, users[0].password);
        if (!isMatch) {
            throw new Error("Invalid email or password");
        }

        delete users[0].password;



        if (users[0].account_type === "Employee") {
            // שליפת פרטי עובד
            const employee = await UserService.EmployeeService.getEmployeeIdByUserId(users[0].id_user);
            users[0].employee_id = employee?.id_employee || null;
    
            // שליפת כל התפקידים של העובדD
            if (users[0].employee_id) {
                const rolesQuery = `
                SELECT role_id
                FROM alehZayis.employee_roles
                WHERE employee_id = ?
            `;
            const roles = await executeQuery(rolesQuery, [users[0].employee_id]);
            users[0].roles = roles.map(r => r.role_id); // מחזיר רק מערך של מזהים
                        } else {
                users[0].roles = [];
            }
        }
    

        // if (users[0].account_type === "Employee") {
        //     const employee = await UserService.EmployeeService.getEmployeeIdByUserId(users[0].id_user);
        //     users[0].employee_id = employee.id_employee || null; // אם לא נמצא, שים null
        //     users[0].role_id = employee.role_id
        // }

        return users[0];
    }


    async registerUser(params) {
        const email = params.email;
        const name = params.name;
        await this.userExists(email);
        const clickupUser = await this.validateClickUpUser(email);
        const {userId, rawPassword} = await this.createUserEntry(params);
        if (!userId) {
            throw new Error("Failed to create user");
        }

        await UserService.EmployeeService.createEmployee({
            user_id: userId,
            clickup_id: clickupUser.id,
            roles: clickupUser.roles
        });
        await sendMail({
            to: "tz0556776105@gmail.com",
            subject: 'Welcome to Aleh Zayis Website!',
            html: welcomeEmailTemplate(name, rawPassword)
        });

        return userId;
    }


    async createUserEntry(params) {
        const rawPassword = generateRandomPassword();
        const hashedPassword = await bcrypt.hash(rawPassword, 10);

        const newUser = {
            name: params.name,
            email: params.email,
            password: hashedPassword,
            account_type: 'employee'
        };
        const userId = await this.addUser(newUser);
        return {userId, rawPassword}
    }


    async validateClickUpUser(email) {
        const clickupUser = await findUserByEmailInClickUp(email);
        if (!clickupUser) {
            throw new Error("You're not authorized to register – user not found in ClickUp.");
        }
        return clickupUser;
    }


    async userExists(email) {
        const query = registerUserQuery();
        const users = await executeQuery(query, [email]);
        if (users.length = 0) {
            throw new Error("User already exists");
        }
        return users.length > 0;
    }


    async addUser(params) {
        const userQuery = GeneryQuery.postQuery(UserService.table, Object.keys(params));
        const result = await executeQuery(userQuery, Object.values(params));
        return result.insertId;
    }


    async changePasswordByEmail(email, currentPassword, newPassword) {
        const userQuery = `SELECT id_user, password FROM users WHERE email = ?`;
        const users = await executeQuery(userQuery, [email]);
    
        if (!users || users.length === 0) return false;
    
        const isMatch = await bcrypt.compare(currentPassword, users[0].password);
        if (!isMatch) return false;
    
        const hashed = await bcrypt.hash(newPassword, 10);
        const updateQuery = `UPDATE users SET password = ? WHERE id_user = ?`;
        await executeQuery(updateQuery, [hashed, users[0].id_user]);
    
        return true;
    }
}