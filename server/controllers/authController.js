import { UserService } from '../services/userService.js';
import { createToken } from '../middleware/authenticateToken.js';
import { userSchema } from '../validations/userValidations.js';

export class AuthController {
    static userService = new UserService();

    // פונקציה שתטפל בהתחברות
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
            const { error } = userSchema.validate(req.body);
            if (error) {
                return res.status(400).json({ error: error.details[0].message });
            }

            const idUser = await AuthController.userService.registerUser(req.body);
            return res.status(201).json({ idUser });
            // const token = createToken({ id: idUser });
            // return res
            //     .cookie('x-access-token', token, { httpOnly: true, secure: true, maxAge: 259200000 })
            //     .json({ id: idUser });
        } catch (ex) {
            next({
                statusCode: ex.errno === 1062 ? 409 : 500,
                message: ex.message || ex
            });
        }
    }

}