import { executeQuery } from "../config/db.js";
import { ClickUpService } from "./clickUpService.js";

const clickUpService = new ClickUpService();
const folderName = "Freelancer Database";

export async function syncClickUpBooks() {
  const folderId = await clickUpService.getFolderIdByName(folderName);
  const lists = await clickUpService.getLists(folderId);

  for (const list of lists.lists) {
    const clickup_id = list.id;
    const name = list.name;

    const existing = await executeQuery(
      "SELECT 1 FROM books WHERE clickup_id = ?",
      [clickup_id]
    );

    if (existing.length === 0) {
      await executeQuery(
        "INSERT INTO books (clickup_id, name) VALUES (?, ?)",
        [clickup_id, name]
      );
    }
  }
}
