import bcrypt from 'bcrypt';
import executeQuery from '../config/db.js';
import { loginUserQuery, registerUserQuery } from '../queries/userQueries.js';
import { GeneryQuery } from "../queries/generyQueries.js";
import {EmployeeService} from "./employeesService.js"


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
        const { name, password, email, isEmployee } = params;
        const userExists = await this.userExists(name);
        if (userExists) {
            throw new Error("User already exists");
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = { name: name, password: hashedPassword, email: email, isEmployee: isEmployee };

        // הכנס את המשתמש לטבלת המשתמשים
        const userId = await this.addUser(newUser);
        // const passwordId = await passwordService.addPassword({ password: password });
        // const newUser = { email: email, userName: userName, passwordId: passwordId, isActive: true }
        // const userId = await this.addUser(newUser);

        if (!userId) {
            throw new Error("Failed to create user");
        }
        return userId;
    }













    async userExists(name) {
        // const columns = "1";
        const query = registerUserQuery();
        const users = await executeQuery(query, [name]);
        return users.length > 0;
    }


    async addUser(params) {
        const userQuery = GeneryQuery.postQuery(UserService.table, Object.keys(params));
        const result = await executeQuery(userQuery, Object.values(params));
        return result.insertId;
    }
}