// config/clickUpApiConfig.js
import axios from 'axios';
import https from 'https';

// const CLICKUP_API_KEY = process.env.CLICKUP_API_KEY || 'pk_88286379_SRSB6DJ1NC5MNT2BTD05MQ5ZYW32XQ1N';
const CLICKUP_API_KEY = process.env.CLICKUP_API_KEY;
const agent = new https.Agent({ rejectUnauthorized: false });

// פונקציה גנרית לשליפת נתונים מ-ClickUp API
export async function fetchClickUpAPI(url) {
    try {
        const response = await axios.get(url, {
            headers: { "Authorization": CLICKUP_API_KEY },
            httpsAgent: agent
        });
        return response.data;
    } catch (error) {
        console.error("שגיאה בביצוע בקשה ל-ClickUp API:", error);
        return null;
    }
}
