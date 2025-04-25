import { UserService } from '../services/userService.js';
// import { createToken } from "../utils/tokenUtils.js";
import { createToken } from "../until/tokenUtils.js";
import { userSchema } from '../validations/userValidations.js';

export class AuthController {
    static userService = new UserService();


    async login(req, res, next) {
        try {
            const user = await AuthController.userService.loginUser(req.body);
            const token = createToken({ idUser: user.id_user });

            return res.cookie('x-access-token', token, { httpOnly: true, secure: true, maxAge: 259200000 }).json({ user });
        } catch (ex) {
            next({
                statusCode: ex.errno || 500,
                message: ex.message || ex
            });
        }
    }


    async register(req, res, next) {
        try {
            const idUser = await AuthController.userService.registerUser(req.body);
            return res.status(201).json({ idUser });
        } catch (ex) {
            next({
                statusCode: ex.errno === 1062 ? 409 : 500,
                message: ex.message || ex
            });
        }
    }


    async changePassword(req, res, next) {
        try {
            const { email, currentPassword, newPassword } = req.body;
    
            if (!email || !currentPassword || !newPassword) {
                return res.status(400).json({ message: "Missing fields" });
            }
    
            const userService = new UserService();
            const success = await userService.changePasswordByEmail(email, currentPassword, newPassword);
    
            if (!success) {
                return res.status(401).json({ message: "Email or current password is incorrect" });
            }
    
            res.status(200).json({ message: "Password updated successfully" });
        } catch (ex) {
            next({
                statusCode: ex.errno || 500,
                message: ex.message || ex
            });
        }
    }
}