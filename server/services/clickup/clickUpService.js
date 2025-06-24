import https from "https";
import axios from "axios";
import dotenv from 'dotenv';

dotenv.config();

const API_TOKEN = process.env.CLICKUP_API_TOKEN;
const BASE_URL = 'https://api.clickup.com/api/v2';
const teamId = '8601991'
const spaceId = '12777054'
const agent = new https.Agent({ rejectUnauthorized: false });


const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Authorization': API_TOKEN,
        'Content-Type': 'application/json',
    },
    httpsAgent: agent
});

export class ClickUpService {
    async getTeams() {
        try {
            const response = await api.get('/team');
            return response.data;
        } catch (error) {
            console.error('שגיאה בהבאת הצוותים:', error);
            throw error;
        }
    };

    async getSpaces() {
        try {
            const response = await api.get(`/team/${teamId}/space`);
            return response.data;
        } catch (error) {
            console.error('שגיאה בהבאת ה-Spaces:', error);
            throw error;
        }
    };


    async getFolders() {
        try {
            const response = await api.get(`/space/${spaceId}/folder`);
            return response.data;
        } catch (error) {
            console.error('שגיאה בהבאת תיקיות:', error);
            throw error;
        }
    };


    async getLists(folderId) {
        try {
            const response = await api.get(`/folder/${folderId}/list`);
            return response.data;
        } catch (error) {
            console.error('שגיאה בהבאת הרשימות:', error);
            throw error;
        }
    };


    async getTasks(listId, page = 0) {
        try {
            const response = await api.get(`/list/${listId}/task?page=${page}`);
            return response.data;
        } catch (error) {
            console.error('שגיאה בהבאת המשימות:', error);
            throw error;
        }
    };


    async getAllTasks(listId) {
        let page = 0;
        let allTasks = [];
        let hasMore = true;

        while (hasMore) {
            const response = await api.get(`/list/${listId}/task?page=${page}`);
            const tasks = response.data.tasks;

            allTasks = allTasks.concat(tasks);
            hasMore = !response.data.last_page;
            page++;
        }

        return allTasks;
    }



    async getField(folderId) {
        try {
            const response = await api.get(`/folder/${folderId}/field`);
            return response.data;
        } catch (error) {
            console.error('שגיאה בהבאת המשימות:', error);
            throw error;
        }
    };


    async getFolderIdByName(folderName) {
        try {
            const data = await this.getFolders();
            const folder = data.folders.find(folder => folder.name === folderName);
            return folder.id;
        } catch (error) {
            console.error('שגיאה בהבאת התיקיות:', error);
        }
    }


    async getTaskById(taskId) {
        try {
            const response = await api.get(`/task/${taskId}`);
            return response.data;
        } catch (error) {
            console.error('שגיאה בהבאת המשימות:', error);
            throw error;
        }
    };


    async createTask(listId, taskData) {
        try {
            const response = await api.post(`/list/${listId}/task`, taskData);
            return response.data;
        } catch (error) {
            console.error('שגיאה ביצירת משימה:', error);
            throw error;
        }
    };


    async updateTask(taskId, updatedData) {
        try {
            const response = await api.put(`/task/${taskId}`, updatedData);
            return response.data;
        } catch (error) {
            console.error('שגיאה בעדכון המשימה:', error);
            throw error;
        }
    };


    async deleteTask(taskId) {
        try {
            const response = await api.delete(`/task/${taskId}`);
            return response.data;
        } catch (error) {
            console.error('שגיאה במחיקת משימה:', error);
            throw error;
        }
    };


    async getTaskComments(taskId) {
        try {
            const response = await api.get(`/task/${taskId}/comment`);
            return response.data;
        } catch (error) {
            console.error('שגיאה בהבאת התגובות:', error);
            throw error;
        }
    };


    async addCommentToTask(taskId, commentText) {
        try {
            const response = await api.post(`/task/${taskId}/comment`, {
                comment_text: commentText
            });
            return response.data;
        } catch (error) {
            console.error('שגיאה בהוספת תגובה:', error);
            throw error;
        }
    };


    async getStatuses(spaceId) {
        try {
            const response = await api.get(`/space/${spaceId}/status`);
            return response.data;
        } catch (error) {
            console.error('שגיאה בהבאת הסטטוסים:', error);
            throw error;
        }
    }
};