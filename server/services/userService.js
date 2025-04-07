import bcrypt from 'bcrypt';
import executeQuery from '../config/db.js';
import { loginUserQuery, registerUserQuery } from '../queries/userQueries.js';
import { GeneryQuery } from "../queries/generyQueries.js";
import {EmployeeService} from "./employeesService.js";
// import { getClickUpEmployees } from "./clickUpService.js";
import { getFolderIdFromSpace, getListsInFolder } from './foldersService.js';
import { getTaskMembersFromList } from './tasksService.js';
import { findUserByEmailInClickUp } from './try.js';
import { sendMail } from './MailService.js';




export class UserService {
    static table = "users";
    static EmployeeService = new EmployeeService();

    async loginUser(params) {
        const query = loginUserQuery(); // עדכן את השאילתא כך שתתאים לחיפוש לפי email
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
        const { name, email } = params;

        const clickupUser = await findUserByEmailInClickUp(email);
        if (!clickupUser) {
            throw new Error("You're not authorized to register – user not found in ClickUp.");
        }
        
        const userExists = await this.userExists(email);
        if (userExists) {
            throw new Error("User already exists");
        }

        const rawPassword = this.generateRandomPassword();
        const hashedPassword = await bcrypt.hash(rawPassword, 10);

        const newUser = {
            name: name,
            email,
            password: hashedPassword,
            account_type: 'employee'
        };
        const userId = await this.addUser(newUser);


        await UserService.EmployeeService.createEmployee({
            user_id: userId,
            clickup_id: clickupUser.id
        });
    
        // 6. שליחת מייל עם הסיסמה
        await sendMail({
            to: "tz0556776105@gmail.com",
            subject: 'Welcome to Aleh Zayis Website!',
            html: `
                <h2>Welcome to Aleh Zayis!</h2>
                <p>Your account has been successfully created.</p>
                <p><strong>Password:</strong> ${rawPassword}</p>
                <p>You can now log in using your email and this password.</p>
            `
        });    


        // הכנס את המשתמש לטבלת המשתמשים
        // const passwordId = await passwordService.addPassword({ password: password });
        // const newUser = { email: email, userName: userName, passwordId: passwordId, isActive: true }
        // const userId = await this.addUser(newUser);

        if (!userId) {
            throw new Error("Failed to create user");
        }
        return userId;
    }





    generateRandomPassword() {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let password = '';
        for (let i = 0; i < 6; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            password += characters[randomIndex];
        }
        return password;
    }








    async userExists(email) {
        // const columns = "1";
        const query = registerUserQuery();
        const users = await executeQuery(query, [email]);
        return users.length > 0;
    }


    async addUser(params) {
        const userQuery = GeneryQuery.postQuery(UserService.table, Object.keys(params));
        const result = await executeQuery(userQuery, Object.values(params));
        return result.insertId;
    }
}