import ExcelJS from 'exceljs';
import currencyFormatter from 'currency-formatter';
import { WorkEntriesService } from '../workEntriesService.js';
import { MonthlyChargesService } from '../monthlyChargesService.js';
import i18n from '../../i18n/i18n.js';

const formatQuantity = (num) => {
  return Number(num).toLocaleString('en-US', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
  });
};

const formatHours = (quantity, t) => {
  const hours = Math.floor(quantity);
  const minutes = Math.round((quantity - hours) * 60);
  const parts = [];
  if (hours > 0) parts.push(`${hours} ${t(`units.${hours === 1 ? 'hour' : 'hours'}`)}`);
  if (minutes > 0) parts.push(`${minutes} ${t(`units.${minutes === 1 ? 'minute' : 'minutes'}`)}`);
  return parts.join(` ${t('units.and')} `) || t('units.minutes');
};

export const createMonthlyEmployeeReport = async (employeeId, month, year) => {
  const chargesService = new MonthlyChargesService();
  const fixedCharges = await chargesService.getChargesByEmployee(employeeId);

  const reportsService = new WorkEntriesService();
  const summary = await reportsService.getMonthlySummaryByEmployee(employeeId, { month, year });
  if (!summary || summary.length === 0) {
    return null;
  }

  let language = 'en';
  let currency = summary[0]?.currency || 'ILS';
  if (currency === 'ILS') language = 'he';

  const localI18n = i18n.cloneInstance();
  await localI18n.init();
  await localI18n.changeLanguage(language);
  const t = localI18n.t;

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet(t('messages.worksheetName'), {
    properties: { rtl: language === 'he' }
  });

  const headers = language === 'he'
    ? [
      t('headers.total'),
      t('headers.rate'),
      t('headers.quantity'),
      t('headers.manager'),
      t('headers.projectName'),
      t('headers.az')
    ]
    : [
      t('headers.az'),
      t('headers.projectName'),
      t('headers.manager'),
      t('headers.quantity'),
      t('headers.rate'),
      t('headers.total')
    ];

  sheet.addRow(headers);
  sheet.getRow(1).font = { bold: true };

  let total = 0;
  let quantitySum = '';

  summary.forEach(entry => {
    const isHours = entry.type === 'hours';
    const quantityStr = isHours
      ? formatHours(entry.quantity, t)
      : `${formatQuantity(entry.quantity)} ${t(`units.${entry.unit}`) || entry.unit}`;

    const rateStr = currencyFormatter.format(entry.rate, { code: entry.currency || 'ILS' });

    const totalStr = currencyFormatter.format(entry.total, { code: entry.currency || 'ILS' });

    const rowValues = language === 'he'
      ? [
        totalStr,
        rateStr,
        quantityStr,
        entry.projectManagerName || '',
        entry.book_name || '',
        entry.AZ_book_id || ''
      ]
      : [
        entry.AZ_book_id || '',
        entry.book_name || '',
        entry.projectManagerName || '',
        quantityStr,
        rateStr,
        totalStr
      ];

    sheet.addRow(rowValues);

    total += entry.total;
    quantitySum = quantityStr;
  });

  if (fixedCharges.length > 0) {
    fixedCharges.forEach(charge => {
      const amount = Number(charge.amount || 0);
      total += amount;

      const rowValues = language === 'he'
        ? [
          currencyFormatter.format(amount, { code: currency }),
          charge.charge_name || '',
          '', '', '',
          t('headers.specialPayments')
        ]
        : [
          t('headers.specialPayments'),
          '', '', '',
          charge.charge_name || '',
          currencyFormatter.format(amount, { code: currency })
        ];

      sheet.addRow(rowValues);
    });
  }

  sheet.addRow([]);

  const totalFormatted = currencyFormatter.format(total, { code: currency });
  const totalRow = language === 'he'
    ? [totalFormatted, '', quantitySum, '', '', t('headers.totalRow')]
    : [t('headers.totalRow'), '', '', quantitySum, '', totalFormatted];

  sheet.addRow(totalRow);

  sheet.columns.forEach(col => {
    col.width = 25;
  });

  if (language === 'he') {
    sheet.eachRow(row => {
      row.alignment = { horizontal: 'right' };
    });
  }

  return await workbook.xlsx.writeBuffer();
};