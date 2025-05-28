import axios from 'axios';
import https from 'https';

const CLICKUP_API_KEY = process.env.CLICKUP_API_KEY;
const agent = new https.Agent({ rejectUnauthorized: false });

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
