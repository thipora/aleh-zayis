import bcrypt from 'bcrypt';
import { executeQuery } from '../config/db.js';
import { loginUserQuery, registerUserQuery } from '../queries/userQueries.js';
import { GeneryQuery } from "../queries/generyQueries.js";
import { EmployeeService } from "./employeesService.js";
import { findUserByEmailInClickUp } from './clickup/clickupEmployeeService.js';
import { sendMail } from '../until/mailer.js';
import { welcomeEmailTemplate } from '../until/emailTemplates.js';
// import { generateRandomPassword } from "../utils/passwordUtils.js";
import { generateRandomPassword } from "../until/passwordUtils.js";


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
            const employeeId = await UserService.EmployeeService.getEmployeeIdByUserId(users[0].id_user);
            users[0].employee_id = employeeId.id_employee || null; // אם לא נמצא, שים null
        }

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
            clickup_id: clickupUser.id
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

    // async registerUser(params) {
    //     const { name, email } = params;

    //     const clickupUser = await findUserByEmailInClickUp(email);
    //     if (!clickupUser) {
    //         throw new Error("You're not authorized to register – user not found in ClickUp.");
    //     }

    //     const userExists = await this.userExists(email);
    //     if (userExists) {
    //         throw new Error("User already exists");
    //     }

    //     const rawPassword = this.generateRandomPassword();
    //     const hashedPassword = await bcrypt.hash(rawPassword, 10);

    //     const newUser = {
    //         name: name,
    //         email,
    //         password: hashedPassword,
    //         account_type: 'employee'
    //     };
    //     const userId = await this.addUser(newUser);

    //     await UserService.EmployeeService.createEmployee({
    //         user_id: userId,
    //         clickup_id: clickupUser.id
    //     });

    //     await sendMail({
    //         to: "tz0556776105@gmail.com",
    //         subject: 'Welcome to Aleh Zayis Website!',
    //         html: welcomeEmailTemplate(name, rawPassword)
    //       });          

    //     if (!userId) {
    //         throw new Error("Failed to create user");
    //     }
    //     return userId;
    // }





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


    async changePassword(userId, currentPassword, newPassword) {
        const userQuery = `SELECT password FROM users WHERE id_user = ?`;
        const users = await executeQuery(userQuery, [userId]);

        if (!users || users.length === 0) return false;

        const isMatch = await bcrypt.compare(currentPassword, users[0].password);
        if (!isMatch) return false;

        const hashed = await bcrypt.hash(newPassword, 10);
        const updateQuery = `UPDATE users SET password = ? WHERE id_user = ?`;
        await executeQuery(updateQuery, [hashed, userId]);

        return true;
    }
}