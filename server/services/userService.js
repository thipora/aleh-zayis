import bcrypt from 'bcrypt';
import executeQuery from '../config/db.js';
import { loginUserQuery, registerUserQuery } from '../queries/userQueries.js';
import { GeneryQuery } from "../queries/generyQueries.js";


export class UserService {
    static table = "users";

    // פונקציה שתטפל בהתחברות
    async loginUser(params) {
        const query = loginUserQuery();
        const { name, password } = params;
        const users = await executeQuery(query, [name]);

        if (!users || users.length === 0) {
            throw new Error("Invalid name or password");
        }

        const isMatch = await bcrypt.compare(password, users[0].password);
        if (!isMatch) {
            throw new Error("Invalid name or password");
        }

        delete users[0].password;
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



    async createJob(userId, { date, workQuantity, bookId, description, notes, paymentTypeId }) {
        const employeeQuery = "SELECT id_employee FROM employees WHERE user_id = ?";
        const employees = await executeQuery(employeeQuery, [userId]);

        if (!employees.length) throw new Error("Employee not found");

        const employeeId = employees[0].id_employee;

        const query = `
            INSERT INTO ${JobsService.table} (employee_id, date, work_quantity, book_id, description, notes, payment_type_id)
            VALUES (?, ?, ?, ?, ?, ?, ?)`;

        const values = [employeeId, date, workQuantity, bookId, description, notes, paymentTypeId];

        const result = await executeQuery(query, values);
        return { id_work_logs: result.insertId, ...values }; // מחזיר את פרטי העבודה החדשה
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