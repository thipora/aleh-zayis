import { ProjectsService } from '../services/projectsService.js'; // ✅ ייבוא
const projectsService = new ProjectsService(); 

export class ProjectsController {
  // שליפת פרויקטים של עובד לפי clickup_id
    async getProjectsByEmployee(req, res, next) {
      try {
        const { employeeId } = req.params;
        const projects = await projectsService.getProjectsByEmployeeId(employeeId);
        res.json(projects);
      } catch (err) {
        next({
          statusCode: 500,
          message: err.message || 'Failed to fetch projects'
        });
      }
    }
  

};
