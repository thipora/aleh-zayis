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

    const language = employee.currency === 'ILS' ? 'he' : 'en';

    const buffer = await createMonthlyEmployeeReport(employeeId, month, year, language || 'en');
    if (!buffer) {
        console.log(`ℹ️ No work entries found for ${employee.name} in ${month}/${year}, skipping email.`);
        return;
    }

    const subject = language === 'he'
        ? `דוח חודשי - ${month}/${year}`
        : `Monthly Report - ${month}/${year}`;

    const html = monthlyReportEmailTemplate(employee.name, month, year, language || 'en');

    await sendMail({
        to: employee.email,
        subject,
        html,
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
        const language = emp.currency === 'ILS' ? 'he' : 'en';
        try {
            await sendMonthlyReportToEmployee(emp.id_employee, month, year, language);
        } catch (error) {
            console.error(`❌ Error sending report to ...${emp.name}:`, error.message);
        }
    }

    console.log("🎉 Finished sending all reports");
};
