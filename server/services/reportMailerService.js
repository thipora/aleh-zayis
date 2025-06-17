import { createMonthlyEmployeeReport } from "./excel/employeeReportExcel.js";
import { sendMail } from "../util/mailer.js";
import { monthlyReportEmailTemplate } from "../util/emailTemplates.js";
import { EmployeeService } from './employeesService.js';

/**
 * Sends a monthly report to an employee via email with an attached Excel file
 * @param {number} employeeId - The ID of the employee
 * @param {number} month - The report month (1-12)
 * @param {number} year - The report year
 */
export const sendMonthlyReportToEmployee = async (employeeId, month, year) => {
    const employeeService = new EmployeeService();
    const employee = await employeeService.getEmployeeById(employeeId);
    if (!employee) throw new Error("Employee email not found");

    const buffer = await createMonthlyEmployeeReport(employeeId, month, year, []);
    if (!buffer) {
        console.log(`ℹ️ No work entries found for ${employee.name} in ${month}/${year}, skipping email.`);
        return;
    }
    
    await sendMail({
        // to: employee.email,
        to: "tz0556776105@gmail.com",
        subject: `Monthly Report - ${month}/${year}`,
        html: monthlyReportEmailTemplate(employee.name, month, year),
        attachments: [
            {
                filename: `Monthly_Report_${employee.name}_${month}_${year}.xlsx`,
                content: buffer,
                contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            }
        ]
    });

    console.log(`✅ Report sent to employee ${employee.name}`);
};


export const sendMonthlyReportsToAllEmployees = async (month, year) => {
    const employeeService = new EmployeeService();
    const employees = await employeeService.getAllEmployees();

    for (const emp of employees) {
        try {
            await sendMonthlyReportToEmployee(emp.id_employee, month, year);
        } catch (error) {
            console.error(`❌ שגיאה בשליחת דוח ל־${emp.name}:`, error.message);
        }
    }

    console.log("🎉 סיום שליחת כל הדוחות");
};
