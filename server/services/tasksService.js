import { fetchClickUpAPI } from '../config/clickUpApiConfig.js';

export async function getTaskMembersFromList(listId) {
    const data = await fetchClickUpAPI(`https://api.clickup.com/api/v2/list/${listId}/task`);
    if (data) {
        const emails = new Set();

        data.tasks.forEach(task => {
            if (task.custom_fields) {
                task.custom_fields.forEach(field => {
                    console.log(task.custom_fields);
                    if (field.name === 'Email') {
                        if (field.name.value) {
                            emails.add(field.value);
                        }
                    }
                });
            }
        });
    
    
        const tasks = data.tasks;

        console.log(tasks[0]);
        tasks.forEach(task => {
            if (task.creator && task.creator.email) {
                emails.add(task.creator.email);
            }
            if(task.Email || task.email){
                console.log(task.Email)
            }
            if (task.assignees) {
                task.assignees.forEach(assignee => {
                    if (assignee.email) {
                        emails.add(assignee.email);
                    }
                });
            }
        });

        return [...emails];
    }
    return [];
}
