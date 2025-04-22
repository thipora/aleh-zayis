import { ClickUpService } from "./clickUpService.js";
const clickUpService = new ClickUpService();
// const spaceId = process.env.CLICKUP_TEAM_ID || '8601991';
const folderName = 'Our Projects'


export class ClickupProjectsService {
    async getProjectsByUser(userId) {
        const FolderId = await clickUpService.getFolderIdByName(folderName);
        const data = await clickUpService.getLists(FolderId);
        const currentList = await data.lists.find(list => list.name === 'Current Projects');
        if (!currentList) {
            throw new Error('List named "Current Projects" not found');
        }
        const projects = await clickUpService.getTasks(currentList.id);

        return projects;
    }

}
