import ExcelJS from 'exceljs';
import currencyFormatter from 'currency-formatter';
import { WorkEntriesService } from '../workEntriesService.js';
import { MonthlyChargesService } from '../monthlyChargesService.js';

const formatQuantity = (num) => {
  return Number(num).toLocaleString('en-US', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
  });
};

const formatHours = (quantity) => {
  const hours = Math.floor(quantity);
  const minutes = Math.round((quantity - hours) * 60);
  const parts = [];
  if (hours > 0) parts.push(`${hours} hour${hours !== 1 ? 's' : ''}`);
  if (minutes > 0) parts.push(`${minutes} minute${minutes !== 1 ? 's' : ''}`);
  return parts.join(' and ') || '0 minutes';
};

export const createMonthlyEmployeeReport = async (employeeId, month, year) => {
  const chargesService = new MonthlyChargesService();
  const fixedCharges = await chargesService.getChargesByEmployee(employeeId);

  const reportsService = new WorkEntriesService();
  const summary = await reportsService.getMonthlySummaryByEmployee(employeeId, { month, year });
  if (!summary || summary.length === 0) {
    return null;
  }

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Monthly Report');

  const headers = ['AZ', 'Project Name', 'Project Manager', 'Quantity', 'Rate', 'Total Payment'];
  sheet.addRow(headers);
  sheet.getRow(1).font = { bold: true };

  let total = 0;
  let currency = 'ILS';
  let quantitySum = '';

  summary.forEach(entry => {
    const isHours = entry.type === 'hours';
    const quantityStr = isHours
      ? formatHours(entry.quantity)
      : `${formatQuantity(entry.quantity)} ${entry.unit}`;

    const rateStr = isHours
      ? `${entry.rate} per hour`
      : `${entry.rate} per ${entry.unit}`;

    const totalStr = currencyFormatter.format(entry.total, { code: entry.currency || 'ILS' });

    sheet.addRow([
      entry.AZ_book_id || '',
      entry.book_name || '',
      entry.projectManagerName || '',
      quantityStr,
      rateStr,
      totalStr
    ]);

    total += entry.total;
    currency = entry.currency || currency;
    quantitySum = quantityStr;
  });

  if (fixedCharges.length > 0) {
    fixedCharges.forEach(charge => {
      const amount = Number(charge.amount || 0);
      total += amount;

      sheet.addRow([
        'Special Payments',                          // AZ
        '',                                          // Project Name
        '',                                          // Project Manager
        '',                                          // Quantity
        charge.charge_name || '',                    // Rate
        currencyFormatter.format(amount, { code: currency })  // Total Payment
      ]);
    });
  }

  sheet.addRow([]);

  const totalFormatted = currencyFormatter.format(total, { code: currency });
  sheet.addRow(['Total', '', '', quantitySum, '', totalFormatted]);

  sheet.columns.forEach(col => {
    col.width = 25;
  });

  return await workbook.xlsx.writeBuffer();
};
