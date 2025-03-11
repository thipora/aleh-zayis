import bcrypt from 'bcrypt';
import executeQuery from '../config/db.js';
import { loginUserQuery } from '../queries/userQueries.js';

export class UserService {
    static table = "users";

    // פונקציה שתטפל בהתחברות
    async loginUser(params) {
        const query = loginUserQuery();
        const { name, password } = params;
        const users = await executeQuery(query, [name]);

        if (!users || users.length === 0) {
            throw new Error("Invalid email or password");
        }

        // השוואת הסיסמה עם הסיסמה המאוחסנת בבסיס הנתונים
        const isMatch = await bcrypt.compare(password, users[0].password);
        if (!isMatch) {
            throw new Error("Invalid email or password");
        }

        delete users[0].password; // לא מחזירים את הסיסמה
        return users[0];
    }
}