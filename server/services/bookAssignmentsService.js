import { executeQuery } from "../config/db.js";
import { ClickUpService } from "./clickup/clickUpService.js";
import { fetchBooksFromClickUp } from './bookSyncService.js';

export class BookAssignmentsService {
  constructor() {
    this.clickUpService = new ClickUpService();
  }



  async getOrCreateBookByAZId(AZ_book_id) {
    const [book] = await executeQuery(
      'SELECT id_book, clickup_id FROM books WHERE AZ_book_id = ?',
      [AZ_book_id]
    );

    if (book) return book;

    const books = await fetchBooksFromClickUp(AZ_book_id);

    const my_book = books.find(b => b.AZ_book_id === AZ_book_id);


    if (!my_book) throw new Error('Book not found in ClickUp');

    const { clickup_id, project_manager_clickup_id, name } = my_book;

    const result = await executeQuery(
      'INSERT INTO books (clickup_id, AZ_book_id, project_manager_clickup_id, name) VALUES (?, ?, ?, ?)',
      [clickup_id, AZ_book_id, project_manager_clickup_id, name]
    );

    return {
      id_book: result.insertId,
      clickup_id: clickup_id
    };
  }


  async getEmployeeClickUpId(employeeId) {
    const [employee] = await executeQuery(
      'SELECT clickup_id FROM employees WHERE id_employee = ?',
      [employeeId]
    );
    if (!employee) throw new Error('Employee not found');
    return employee.clickup_id;
  }




  async getEmployeeRoleInBook(task, employeeClickUpId) {
    const user = await this.clickUpService.getTaskById(employeeClickUpId);
    const employeeName = user.name;
    if (!employeeName) throw new Error('Employee name not found');

    const customFields = task.custom_fields || [];
    const ROLES = ['Editor', 'Typist', 'Graphics', 'Layout', 'Manager'];

    for (const role of ROLES) {
      const field = customFields.find(f => f.name === role);
      if (!field || !field.value) continue;

      const options = field.type_config?.options || [];
      const valueIds = field.value;

      if (Array.isArray(field.value)) {
        for (const valueId of valueIds) {
          const option = options.find(opt => opt.id === valueId);
          if (!option) continue;

          const label = option.label;
          if (employeeName.includes(label) || label.includes(employeeName)) {
            return role; // מצאנו תפקיד תואם
          }
        }
      } else {

        const option = options.find(opt => opt.orderindex === valueIds);
        const name = option.name;
        if (employeeName.includes(name) || name.includes(employeeName)) {
          return role; // מצאנו תפקיד תואם
        }
      }

    }

    return null; // לא נמצא תפקיד
  }



  async extractEmployeesFromField(field, allEmployees, role) {
    const results = [];

    const valueIds = Array.isArray(field?.value) ? field.value : [];
    const options = field?.type_config?.options || [];

    for (const valueId of valueIds) {
      const option = options.find(opt => opt.id === valueId);
      if (!option) continue;

      const employeeName = option.label;

      const employee = allEmployees.find(e => e.name.includes(employeeName));
      if (employee) {
        results.push({
          clickupId: employee.id,
          name: employee.name,
          role
        });
      }
    }

    return results;
  }





  async assignEmployeeToBookByAZId(employeeId, AZ_book_id, selectedRoleIds = []) {
    const book = await this.getOrCreateBookByAZId(AZ_book_id);
    const bookClickUpId = book.clickup_id;
    const employeeClickUpId = await this.getEmployeeClickUpId(employeeId);
    const task = await this.clickUpService.getTaskById(bookClickUpId);
    if (!task) throw new Error('Book task not found in ClickUp');

    const roleIdsToInsert = [];

    // תמיד בודקים את התפקיד האמיתי של העובד בספר לפי ClickUp
    const roleFromClickUp = await this.getEmployeeRoleInBook(task, employeeClickUpId);
    if (!roleFromClickUp) {
      return { inserted: false, message: 'Employee is not assigned to this book in ClickUp' };
    }

    // נביא את id_role של התפקיד שמוחזר מ-ClickUp
    const [roleRow] = await executeQuery(
      'SELECT id_role FROM roles WHERE role_name = ?',
      [roleFromClickUp]
    );
    if (!roleRow) throw new Error(`Role "${roleFromClickUp}" not found in DB`);

    const matchedRoleId = roleRow.id_role;

    // אם נשלחו selectedRoleIds – נוודא שהוא נמצא בתוכם
    if (selectedRoleIds.length > 0) {
      if (!selectedRoleIds.includes(matchedRoleId)) {
        return {
          inserted: false,
          message: 'Selected roles do not match ClickUp role'
        };
      }
    }

    // בדוק אם יש הרשאה בתפקיד הזה בטבלת employee_roles
    const [empRole] = await executeQuery(
      'SELECT id_employee_role FROM employee_roles WHERE employee_id = ? AND role_id = ?',
      [employeeId, matchedRoleId]
    );
    if (!empRole) {
      return { inserted: false, message: 'Employee does not have this role in DB' };
    }

    roleIdsToInsert.push(empRole.id_employee_role);

    // הכנסת הרשומה
    for (const employeeRoleId of roleIdsToInsert) {
      await executeQuery(
        'INSERT IGNORE INTO book_assignments (book_id, employee_role_id) VALUES (?, ?)',
        [book.id_book, employeeRoleId]
      );
    }

    return {
      inserted: true,
      message: `Employee assigned to book`,
      bookId: book.id_book
    };
  }

}
