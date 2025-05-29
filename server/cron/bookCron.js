import cron from 'node-cron';
import { syncBooksToDatabase } from '../services/bookSyncService.js';

cron.schedule('0 2 * * *', async () => {
  try {
    console.log('Running book sync...');
    await syncBooksToDatabase();
    console.log('Book sync complete.');
  } catch (err) {
    console.error('Book sync failed:', err.message);
  }
});