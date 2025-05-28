import { syncClickUpBooks } from "../services/clickupBooksSyncService.js";
import { db } from "../config/db.js";
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
    if (db.end) db.end();
  }
})();
