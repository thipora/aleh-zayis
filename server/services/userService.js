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

        // השוואת הסיסמה עם הסיסמה המאוחסנת בבסיס הנתונים
        const isMatch = await bcrypt.compare(password, users[0].password);
        if (!isMatch) {
            throw new Error("Invalid name or password");
        }

        delete users[0].password; // לא מחזירים את הסיסמה
        return users[0];
    }


    async registerUser(params) {
        const { name, password } = params;
        const userExists = await this.userExists(name);
        if (userExists) {
            throw new Error("User already exists");
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = { name: name, password: hashedPassword };

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