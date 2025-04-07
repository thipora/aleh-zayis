// foldersService.js
import { fetchClickUpAPI } from '../config/clickUpApiConfig.js';

// const FOLDER_NAME = 'Freelancer Database';

// export async function getFolderIdFromSpace(spaceId) {
//     const data = await fetchClickUpData(`https://api.clickup.com/api/v2/space/${spaceId}/folder`);
//     if (data) {
//         const folder = data.folders.find(folder => folder.name === FOLDER_NAME);
//         if (folder) {
//             return folder.id;
//         }
//     }
//     return null;
// }

// export async function getListsInFolder(folderId) {
//     const data = await fetchClickUpData(`https://api.clickup.com/api/v2/folder/${folderId}/list`);
//     if (data) {
//         return data.lists;
//     }
//     return [];
// }

export async function getFolderIdFromSpace(spaceId) {
    const FOLDER_NAME = 'Freelancer Database';
    const data = await fetchClickUpAPI(`https://api.clickup.com/api/v2/space/${spaceId}/folder`);
    if (data) {
        const folder = data.folders.find(folder => folder.name === FOLDER_NAME);
        return folder ? folder.id : null;
        //104284054
    }
    return null;
}

export async function getListsInFolder(folderId) {
    const data = await fetchClickUpAPI(`https://api.clickup.com/api/v2/folder/${folderId}/list`);
    return data ? data.lists : [];




    // try {
    //     const response = await axios.get(`https://api.clickup.com/api/v2/folder/${folderId}/list`, {
    //         headers: {
    //             "Authorization": CLICKUP_API_KEY
    //         },
    //         httpsAgent: agent
    //     });

    //     // חפש את הרשימות Transcribers, EDITORS ו-TYPISTS
    //     const lists = response.data.lists.filter(list => LIST_NAMES.includes(list.name));
        
    //     if (lists.length > 0) {
    //         for (const list of lists) {
    //             await getTaskMembersFromList(list.id);
    //         }
    //     } else {
    //         console.log("No matching lists found");
    //     }

    // } catch (error) {
    //     console.error("Error fetching Lists:", error);
    // }

}

