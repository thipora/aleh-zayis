import { UserService } from '../services/userService.js';
import { createToken } from "../util/tokenUtils.js";

export class AuthController {
    static userService = new UserService();


    async login(req, res, next) {
        try {
            const user = await AuthController.userService.loginUser(req.body);
            const token = createToken({ idUser: user.id_user });

            return res.cookie('x-access-token', token, { httpOnly: true, secure: true, maxAge: 259200000 }).json({ user, token });
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
            const { userId, currentPassword, newPassword } = req.body;

            if (!userId || !currentPassword || !newPassword) {
                return res.status(400).json({ message: "Missing fields" });
            }

            const userService = new UserService();
            const success = await userService.changePasswordByEmail(userId, currentPassword, newPassword);

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

    async forgotPassword(req, res, next) {
        try {
            const { email } = req.body;
            if (!email) {
                return res.status(400).json({ message: "Email is required" });
            }

            const userService = new UserService();
            const success = await userService.resetPasswordByEmail(email);


            if (!success) {
                return res.status(401).json({ message: "Email or current password is incorrect" });
            }



            res.status(200).json({ message: "Password reset and sent by email." });
        } catch (error) {
            next(error);
        }
    }

    logout(req, res, next) {
        try {
            AuthController.userService.logoutUser(res);
            res.status(200).json({ message: "Logged out successfully" });
        } catch (error) {
            next({
                statusCode: 500,
                message: err.message || "Logout failed"
            });
        }
    }

    async validateToken(req, res) {
        try {
            const token = req.cookies["x-access-token"];
            if (!token) {
                return res.status(401).json({ valid: false });
            }

            const user = await AuthController.userService.verifyAndGetUserFromToken(token);

            if (!user) {
                return res.status(401).json({ valid: false });
            }

            return res.status(200).json({
                valid: true,
                user
            });
        } catch (error) {
            console.error("validateToken error:", error);
            return res.status(401).json({ valid: false });
        }
    }

}