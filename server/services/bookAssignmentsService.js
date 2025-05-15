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





  // async assignEmployeeToBookByAZId(employeeId, AZ_book_id, selectedRoleIds = []) {
  //   const book = await this.getOrCreateBookByAZId(AZ_book_id);
  //   const bookClickUpId = book.clickup_id;
  //   const employeeClickUpId = await this.getEmployeeClickUpId(employeeId);
  //   const task = await this.clickUpService.getTaskById(bookClickUpId);
  //   if (!task) throw new Error('Book task not found in ClickUp');

  //   const roleIdsToInsert = [];

  //   // תמיד בודקים את התפקיד האמיתי של העובד בספר לפי ClickUp
  //   const roleFromClickUp = await this.getEmployeeRoleInBook(task, employeeClickUpId);
  //   if (!roleFromClickUp) {
  //     return { inserted: false, message: 'Employee is not assigned to this book in ClickUp' };
  //   }

  //   // נביא את id_role של התפקיד שמוחזר מ-ClickUp
  //   const [roleRow] = await executeQuery(
  //     'SELECT id_role FROM roles WHERE role_name = ?',
  //     [roleFromClickUp]
  //   );
  //   if (!roleRow) throw new Error(`Role "${roleFromClickUp}" not found in DB`);

  //   const matchedRoleId = roleRow.id_role;

  //   // אם נשלחו selectedRoleIds – נוודא שהוא נמצא בתוכם
  //   if (selectedRoleIds.length > 0) {
  //     if (!selectedRoleIds.includes(matchedRoleId)) {
  //       return {
  //         inserted: false,
  //         message: 'Selected roles do not match ClickUp role'
  //       };
  //     }
  //   }

  //   // בדוק אם יש הרשאה בתפקיד הזה בטבלת employee_roles
  //   const [empRole] = await executeQuery(
  //     'SELECT id_employee_role FROM employee_roles WHERE employee_id = ? AND role_id = ?',
  //     [employeeId, matchedRoleId]
  //   );
  //   if (!empRole) {
  //     return { inserted: false, message: 'Employee does not have this role in DB' };
  //   }

  //   roleIdsToInsert.push(empRole.id_employee_role);

  //   // הכנסת הרשומה
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

  // קבלת התפקיד האמיתי מה-ClickUp
  const roleFromClickUp = await this.getEmployeeRoleInBook(task, employeeClickUpId);
  if (!roleFromClickUp) {
    return { inserted: false, message: 'Employee is not assigned to this book in ClickUp' };
  }

  // שליפת id_role מה-DB
  const [roleRow] = await executeQuery(
    'SELECT id_role FROM roles WHERE role_name = ?',
    [roleFromClickUp]
  );
  if (!roleRow) throw new Error(`Role "${roleFromClickUp}" not found in DB`);
  const matchedRoleId = roleRow.id_role;

  // אימות מול selectedRoleIds אם נשלחו
  if (selectedRoleIds.length > 0 && !selectedRoleIds.includes(matchedRoleId)) {
    return {
      inserted: false,
      message: 'Selected roles do not match ClickUp role'
    };
  }

  // בדיקת הרשאה של העובד לתפקיד הזה
  const [empRole] = await executeQuery(
    'SELECT id_employee_role FROM employee_roles WHERE employee_id = ? AND role_id = ?',
    [employeeId, matchedRoleId]
  );
  if (!empRole) {
    return { inserted: false, message: 'Employee does not have this role in DB' };
  }

  const employeeRoleId = empRole.id_employee_role;

  // בדוק אם כבר קיימת שורה בטבלת book_assignments
  const [existingAssignment] = await executeQuery(
    `SELECT * FROM book_assignments 
     WHERE book_id = ? AND employee_role_id = ?`,
    [book.id_book, employeeRoleId]
  );

  if (existingAssignment) {
    if (existingAssignment.is_completed === 1) {
      // אם הושלם בעבר – נעדכן אותו ל-active
      await executeQuery(
        `UPDATE book_assignments 
         SET is_completed = 0 
         WHERE id_book_assignments = ?`,
        [existingAssignment.id_book_assignments]
      );

      return {
        inserted: true,
        message: 'Book assignment reactivated (was previously completed)',
        bookId: book.id_book
      };
    } else {
      // כבר קיים ולא הושלם – לא נעשה כלום
      return {
        inserted: false,
        message: 'Book assignment already exists and is active',
        bookId: book.id_book
      };
    }
  }

  // אם לא קיים בכלל – ניצור חדש
  await executeQuery(
    `INSERT INTO book_assignments (book_id, employee_role_id) 
     VALUES (?, ?)`,
    [book.id_book, employeeRoleId]
  );

  return {
    inserted: true,
    message: 'New book assignment inserted',
    bookId: book.id_book
  };
}


  async markBookAsCompleted(employeeId, bookId) {
    // const sql = `
    //   UPDATE book_assignments
    //   SET is_completed = TRUE
    //   WHERE employee_role_id = ? AND book_id = ?
    // `;
    // await executeQuery(sql, [employeeRoleId, bookId]);
    const rolesSql = `
    SELECT id_employee_role
    FROM employee_roles
    WHERE employee_id = ?
  `;
    const roles = await executeQuery(rolesSql, [employeeId]);
    const roleIds = roles.map(r => r.id_employee_role);

    if (roleIds.length === 0) {
      throw new Error("No employee roles found for this employee.");
    }

    // שלב 2: עדכון book_assignments עבור כל התפקידים האלה
    const updateSql = `
    UPDATE book_assignments
    SET is_completed = 1
    WHERE book_id = ? AND employee_role_id IN (${roleIds.map(() => '?').join(',')})
  `;
    await executeQuery(updateSql, [bookId, ...roleIds]);

  }

  async getBooksForEmployee(employeeId) {
    const sql = `
    SELECT 
      books.id_book,
      books.name AS title,
      roles.role_name,
      book_assignments.is_completed
    FROM book_assignments
    JOIN books ON book_assignments.book_id = books.id_book
    JOIN employee_roles ON book_assignments.employee_role_id = employee_roles.id_employee_role
    JOIN roles ON employee_roles.role_id = roles.id_role
    WHERE employee_roles.employee_id = ? AND book_assignments.completed = '0'
  `;
    return await executeQuery(sql, [employeeId]);
  }

}
