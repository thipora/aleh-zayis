// import { executeQuery } from "../config/db.js";
// import { ClickUpService } from "./clickUpService.js";

// const clickUpService = new ClickUpService();
// const folderName = "Projects Folder"; // שנה לשם התקייה שלך

// export async function syncClickUpBooks() {
//   const folderId = await clickUpService.getFolderIdByName(folderName);
//   const lists = await clickUpService.getLists(folderId);

//   for (const list of lists.lists) {
//     const clickup_id = list.id;
//     const name = list.name;

//     // בדוק אם הספר כבר קיים
//     const existing = await executeQuery("SELECT id_book FROM books WHERE clickup_id = ?", [clickup_id]);

//     if (existing.length === 0) {
//       await executeQuery(
//         "INSERT INTO books (clickup_id, name) VALUES (?, ?)",
//         [clickup_id, name]
//       );
//     }
//   }
// }


// scripts/syncClickUpBooks.js
import { syncClickUpBooks } from "../services/clickupBooksSyncService.js";
import { db } from "../config/db.js"; // אם יש לך חיבור שמצריך פתיחה/סגירה
import dotenv from "dotenv";
dotenv.config();

(async () => {
  try {
    console.log("Starting ClickUp books sync...");
    await syncClickUpBooks();
    console.log("Sync completed.");
  } catch (err) {
    console.error("Sync failed:", err);
  } finally {
    if (db.end) db.end(); // אם את משתמשת בחיבור שצריך לסגור
  }
})();
