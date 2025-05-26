// APIrequests.js
const API_URL = 'http://localhost:8080';

export class APIrequests {
    async postRequest(url, body) {
        try {
            const response = await fetch(API_URL + url, {
                method: 'POST',
                credentials: 'include',
                body: JSON.stringify(body),
                headers: {
                    'Content-type': 'application/json',
                },
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error);
            }
            return data;
        } catch (error) {
            console.log("error" + error);
            throw error;
        };
    }





    async getRequest(url) {
        try {
            const response = await fetch(API_URL + url, {
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error);
            }
            return data;
        } catch (error) {
            throw error;
        }
    }

    async putRequest(url, body) {
        try {
            const response = await fetch(API_URL + url, {
                method: 'PUT',
                credentials: 'include',
                body: JSON.stringify(body),
                headers: {
                    'Content-type': 'application/json',
                },
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error);
            }
            return data;
        } catch (error) {
            throw error;
        }
    }

    async deleteRequest(url) {
        try {
            const response = await fetch(API_URL + url, {
                method: 'DELETE',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.text();
            if (!response.ok) {
                throw new Error(data.error);
            }
            return data;
        } catch (error) {
            throw error;
        }
    }
}
