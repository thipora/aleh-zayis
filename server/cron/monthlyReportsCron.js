import cron from 'node-cron';
import dotenv from 'dotenv';
dotenv.config();

import { sendMonthlyReportsToAllEmployees } from './services/reportMailerService.js';

console.log('⏰ Monthly reports cron is running...');

// 🕛 Every month on the 1st at 04:00
cron.schedule('0 4 1 * *', async () => {
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