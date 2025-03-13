import express from "express";
import { AuthController } from '../controllers/authController.js';

const authRouters = express.Router();

const loginController = new AuthController();
authRouters.post("/login", loginController.login);
authRouters.post("/register", loginController.register)

export { authRouters };