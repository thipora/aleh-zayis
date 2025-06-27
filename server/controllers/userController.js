import { UserService } from "../services/userService.js";

export class UserController {
  static userService = new UserService();

  async updateEnglishName(req, res, next) {
    try {
      const { id } = req.params;
      const { en_name } = req.body;
      if (!en_name) {
        return res.status(400).json({ message: "Missing English name" });
      }
      await UserController.userService.updateEnglishName(id, en_name);
      return res.status(200).json({ message: "English name updated successfully" });
    } catch (ex) {
      next({
        statusCode: ex.errno || 500,
        message: ex.message || ex,
      });
    }
  }
}