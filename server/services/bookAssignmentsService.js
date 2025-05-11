import { executeQuery } from "../config/db.js";
import { ClickUpService } from "./clickup/clickUpService.js";
import {getFreelancersFromClickUp} from "./clickup/clickupEmployeeService.js"

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
  
    const task = await this.clickUpService.getTaskByCustomId(AZ_book_id);
    if (!task) throw new Error('Book not found in ClickUp');
  
    const result = await executeQuery(
      'INSERT INTO books (clickup_id, AZ_book_id, name) VALUES (?, ?, ?)',
      [task.id, task.custom_id, task.name || 'Untitled']
    );
  
    return {
      id_book: result.insertId,
      clickup_id: task.id
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
  

  // async getEmployeeRoleInBook(task, employeeClickUpId) {
  //   const user = await this.clickUpService.getTaskById(employeeClickUpId);
  //   const employeeName = user?.username || user?.name;
  //   if (!employeeName) throw new Error('Employee name not found');
  
  //   const customFields = task.custom_fields || [];
  //   const ROLES = ['Editor', 'Typist', 'Graphics', 'Layout', 'Manager'];
  
  //   let assigned = [];
  
  //   for (const role of ROLES) {
  //     const field = customFields.find(f => f.name === role);
  //     const roleAssignments = await this.extractEmployeesFromField(field, allEmployees, role);
  //     assigned.push(...roleAssignments);
  //   }
  
  //   const match = assigned.find(a => a.clickupId === employeeClickUpId);
  //   return match?.role || null;
  // }

  async getEmployeeRoleInBook(task, employeeClickUpId) {
    const user = await this.clickUpService.getTaskById(employeeClickUpId);
    const employeeName = user?.username || user?.name;
    if (!employeeName) throw new Error('Employee name not found');
  
    const customFields = task.custom_fields || [];
    const ROLES = ['Editor', 'Typist', 'Graphics', 'Layout', 'Manager'];
  
    for (const role of ROLES) {
      const field = customFields.find(f => f.name === role);
      if (!field) continue;
  
      const valueIds = Array.isArray(field.value) ? field.value : [];
      const options = field.type_config?.options || [];
  
      for (const valueId of valueIds) {
        const option = options.find(opt => opt.id === valueId);
        if (!option) continue;
  
        const label = option.label;
        if (employeeName.includes(label) || label.includes(employeeName)) {
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
  



  // async assignEmployeeToBookByAZId(employeeId, AZ_book_id, selectedRoleIds = []) {
  //   const book = await this.getOrCreateBookByAZId(AZ_book_id);
  //   const employeeClickUpId = await this.getEmployeeClickUpId(employeeId);
  
  //   const task = await this.clickUpService.getTaskById(book.clickup_id);
  //   if (!task) throw new Error('Book task not found in ClickUp');
  
  //   const role = await this.getEmployeeRoleInBook(task, employeeClickUpId);
  
  //   if (!role) {
  //     return { inserted: false, message: 'Employee is not assigned to this book in ClickUp' };
  //   }

  //   const [roleRow] = await executeQuery(
  //     'SELECT id_role FROM roles WHERE role_name = ?',
  //     [role]
  //   );
    
  //   if (!roleRow) throw new Error(`Role "${matchedRole}" not found in DB`);

  // const roleId = roleRow.id_role;

  // const [empRole] = await executeQuery(
  //   'SELECT id_employee_role FROM employee_roles WHERE employee_id = ? AND role_id = ?',
  //   [employeeId, roleId]
  // );
  // if (!empRole) throw new Error('Employee does not have this role');

  // const employeeRoleId = empRole.id_employee_role;

  //   await executeQuery(
  //     'INSERT IGNORE INTO book_assignments (book_id, employee_role_id) VALUES (?, ?)',
  //     [book.id_book, employeeRoleId]
  //   );
  
  //   return {
  //     inserted: true,
  //     message: `Employee assigned to book as ${role}`,
  //     bookId: book.id_book
  //   };
  // }
    

//   async assignEmployeeToBookByAZId(employeeId, AZ_book_id, selectedRoleIds = []) {
//   const book = await this.getOrCreateBookByAZId(AZ_book_id);
//   const bookClickUpId = book.clickup_id;

//   const roleIdsToInsert = [];

//   // אם נשלחו selectedRoleIds מהקליינט
//   if (selectedRoleIds.length > 0) {
//     for (const roleId of selectedRoleIds) {
//       const [empRole] = await executeQuery(
//         'SELECT id_employee_role FROM employee_roles WHERE employee_id = ? AND role_id = ?',
//         [employeeId, roleId]
//       );
//       if (empRole) {
//         roleIdsToInsert.push(empRole.id_employee_role);
//       }
//     }
//   } else {
//     // לא נשלחו תפקידים — מקרה ישן: נזהה תפקיד אחד מתוך ClickUp
//     const employeeClickUpId = await this.getEmployeeClickUpId(employeeId);
//     const task = await this.clickUpService.getTaskById(bookClickUpId);
//     if (!task) throw new Error('Book task not found in ClickUp');

//     const role = await this.getEmployeeRoleInBook(task, employeeClickUpId);
//     if (!role) {
//       return { inserted: false, message: 'Employee is not assigned to this book in ClickUp' };
//     }

//     const [roleRow] = await executeQuery(
//       'SELECT id_role FROM roles WHERE role_name = ?',
//       [role]
//     );
//     if (!roleRow) throw new Error(`Role "${role}" not found in DB`);

//     const roleId = roleRow.id_role;
//     const [empRole] = await executeQuery(
//       'SELECT id_employee_role FROM employee_roles WHERE employee_id = ? AND role_id = ?',
//       [employeeId, roleId]
//     );
//     if (!empRole) throw new Error('Employee does not have this role');

//     roleIdsToInsert.push(empRole.id_employee_role);
//   }

//   for (const employeeRoleId of roleIdsToInsert) {
//     await executeQuery(
//       'INSERT IGNORE INTO book_assignments (book_id, employee_role_id) VALUES (?, ?)',
//       [book.id_book, employeeRoleId]
//     );
//   }

//   return {
//     inserted: true,
//     message: `Employee assigned to book`,
//     bookId: book.id_book
//   };
// }

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
