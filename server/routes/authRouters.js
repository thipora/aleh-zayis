import express from "express";
import { AuthController } from '../controllers/authController.js';
import { authLimiter } from "../middleware/rateLimit.js"
import { verifyToken } from "../middleware/authenticateToken.js";


const authRouters = express.Router();
const loginController = new AuthController();

authRouters.post("/login", authLimiter, loginController.login);
authRouters.post("/register", authLimiter, loginController.register);
authRouters.put("/change-password", verifyToken, loginController.changePassword);
authRouters.put("/forgot-password", loginController.forgotPassword);
authRouters.post("/logout", loginController.logout);
authRouters.get("/validate-token", loginController.validateToken);

export { authRouters };