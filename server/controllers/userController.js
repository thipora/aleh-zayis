import { UserService } from "../services/userService.js";

export class UserController {
  static userService = new UserService();

  async updateEnglishName(req, res, next) {
    try {
      console.log("Received request to update English name for user:", req.params.id);
      const { id } = req.params;
      const { name_en } = req.body;

      if (!name_en) {
        return res.status(400).json({ message: "Missing English name" });
      }
console.log("Updating English name for user:", id, "to", name_en);
      await UserController.userService.updateEnglishName(id, name_en);
      console.log("English name updated successfully for user:", id);
      return res.status(200).json({ message: "English name updated successfully" });
    } catch (ex) {
      next({
        statusCode: ex.errno || 500,
        message: ex.message || ex,
      });
    }
  }
}