import express from "express";
import { AuthController } from '../controllers/authController.js';
import { authLimiter } from "../middleware/rateLimit.js";

const authRouters = express.Router();

const loginController = new AuthController();
authRouters.post("/login", authLimiter, loginController.login);
authRouters.post("/register", authLimiter, loginController.register);
authRouters.post("/change-password", loginController.changePassword);

export { authRouters };