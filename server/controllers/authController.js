import { UserService } from '../services/userService.js';
import { createToken } from '../middleware/authenticateToken.js';

export class AuthController {
    static userService = new UserService();

    // פונקציה שתטפל בהתחברות
    async login(req, res, next) {
        try {
            const user = await AuthController.userService.loginUser(req.body);
            const token = createToken({ id: user.id });
            return res.cookie('x-access-token', token, { httpOnly: true, secure: true, maxAge: 259200000 }).json({ user });
        } catch (ex) {
            next({
                statusCode: ex.errno || 500,
                message: ex.message || ex
            });
        }
    }

    // פונקציה שתטפל בהרשמה (אם יש צורך בכך)
    async register(req, res, next) {
        try {
            const user = await AuthController.userService.registerUser(req.body);
            return res.status(201).json({ user });
        } catch (ex) {
            next({
                statusCode: ex.errno || 500,
                message: ex.message || ex
            });
        }
    }
}