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
import { getDBConnection } from '../config/db.js';
import { resetPasswordEmailTemplate } from "../util/emailTemplates.js";


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
            users[0].availability_status = employee.availability_status;

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

        return users[0];
    }


    async registerUser(params) {
        const connection = await getDBConnection();
        try {
            await connection.beginTransaction();

            const email = params.email;
            const name = params.name;
            await this.userExists(email);
            const clickupUser = await this.validateClickUpUser(email);
            const { userId, rawPassword } = await this.createUserEntry(params, connection);
            if (!userId) {
                throw new Error("Failed to create user");
            }

            await UserService.EmployeeService.createEmployee({
                user_id: userId,
                clickup_id: clickupUser.id,
                roles: clickupUser.roles
            }, connection);

            await connection.commit();

            await sendMail({
                to: "tz0556776105@gmail.com",
                subject: 'Welcome to Aleh Zayis Website!',
                html: welcomeEmailTemplate(name, rawPassword)
            });

            return userId;

        } catch {
            await connection.rollback();
            throw err;
        } finally {
            connection.release();
        }
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
        return { userId, rawPassword }
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


    async changePasswordByEmail(id_user, currentPassword, newPassword) {
        const userQuery = `SELECT password FROM users WHERE id_user = ?`;
        const users = await executeQuery(userQuery, [id_user]);

        if (!users || users.length === 0) return false;

        const isMatch = await bcrypt.compare(currentPassword, users[0].password);
        if (!isMatch) return false;

        const hashed = await bcrypt.hash(newPassword, 10);
        const updateQuery = `UPDATE users SET password = ? WHERE id_user = ?`;
        await executeQuery(updateQuery, [hashed, id_user]);

        return true;
    }

    // async resetPasswordByEmail(email) {
    //     const user = await this.getUserByEmail(email);
    //     if (!user) return null;

    //     const newPassword = Math.random().toString(36).slice(-8); // סיסמה רנדומלית
    //     const hashed = await bcrypt.hash(newPassword, 10);

    //     await executeQuery("UPDATE users SET password = ? WHERE id_user = ?", [hashed, user.id_user]);

    //     // שליחת מייל עם הסיסמה החדשה
    //     await sendMail({
    //         to: email,
    //         subject: "Password Reset - Aleh Zayis",
    //         html: resetPasswordEmailTemplate(newPassword),
    //     });

    //     return newPassword;
    // }


    async resetPasswordByEmail(email) {
        // יצירת סיסמה רנדומלית חדשה
        const newPassword = Math.random().toString(36).slice(-8);
        const hashed = await bcrypt.hash(newPassword, 10);

        // ניסיון לעדכן סיסמה לפי אימייל
        const result = await executeQuery("UPDATE users SET password = ? WHERE email = ?", [hashed, email]);

        if (result.affectedRows === 0) {
            throw new Error("No user found with that email");
        }

        // שליחת מייל עם הסיסמה החדשה
        await sendMail({
            to: email,
            subject: "Password Reset - Aleh Zayis",
            html: resetPasswordEmailTemplate(newPassword),
        });

        return true;
    }

    logoutUser(res) {
        res.clearCookie("x-access-token", {
            httpOnly: true,
            secure: true,
            sameSite: "strict"
        });
    }

}