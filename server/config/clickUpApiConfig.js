import axios from 'axios';
import https from 'https';
import axiosRetry from "axios-retry";


const CLICKUP_API_KEY = process.env.CLICKUP_API_KEY;
const agent = new https.Agent({ rejectUnauthorized: false });


axiosRetry(axios, {
  retries: 3,
  retryDelay: retryCount => retryCount * 1000,
  retryCondition: error =>
    axiosRetry.isNetworkError(error) || error.code === "ETIMEDOUT",
});


// export async function fetchClickUpAPI(url) {
//     try {
//         const response = await axios.get(url, {
//             headers: { "Authorization": CLICKUP_API_KEY },
//             httpsAgent: agent
//         });
//         return response.data;
//     } catch (error) {
//         console.error("שגיאה בביצוע בקשה ל-ClickUp API:", error);
//         return null;
//     }
// }

export async function fetchClickUpAPI(url) {
  try {
    const response = await axios.get(url, {
      headers: { Authorization: CLICKUP_API_KEY },
      httpsAgent: agent,
      timeout: 10000,
    });
    return response.data;
  } catch (error) {
    console.error("Error while making request to ClickUp API:");
    if (error.response) {
      console.error("Server responded with status:", error.response.status);
      console.error("Response data:", error.response.data);
    } else if (error.request) {
      console.error("No response received – possible network issue or timeout.");
    } else {
      console.error("Request setup error:", error.message);
    }
    return null;
  }
}
