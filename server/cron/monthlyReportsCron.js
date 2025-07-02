import cron from 'node-cron';
import dotenv from 'dotenv';
dotenv.config();
import { executeQuery } from "../config/db.js";

import { sendMonthlyReportsToAllEmployees } from './services/reportMailerService.js';

console.log('⏰ Monthly reports cron is running...');

// 🕛 Every month on the 3rd at 00:05
cron.schedule('5 0 3 * *', async () => {
    const today = new Date();
    const month = today.getMonth();
    const year = today.getFullYear();

    if (month === 0) {
        month = 12;
        year = year - 1;
    }

    try {
        await sendMonthlyReportsToAllEmployees(month, year);
    } catch (err) {
        console.error('❌ Error in monthly report cron job:', err.message);
    }
});





cron.schedule('0 0 3 * *', async () => {
  const today = new Date();
  let month = today.getMonth();
  let year = today.getFullYear();

  if (month === 0) {
    month = 12;
    year -= 1;
  }

  const query = `
    INSERT INTO locked_months (month, year, locked)
    VALUES (?, ?, 1)
    ON DUPLICATE KEY UPDATE locked = 1
  `;
  await executeQuery(query, [month, year]);

  console.log(`🔒 Month ${month}/${year} is now locked.`);
});
