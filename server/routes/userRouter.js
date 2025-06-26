import express from "express";
import { UserController } from "../controllers/userController.js";

const userRouter = express.Router();
const userController = new UserController();

userRouter.put("/:id/name-en", userController.updateEnglishName);

export { userRouter };
