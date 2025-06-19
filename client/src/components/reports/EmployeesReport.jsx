import React, { useState, useEffect } from "react";
import {
  Box, Paper, Table, TableHead, TableRow,
  TableCell, TableBody, CircularProgress, Button,
  FormControl, InputLabel, Select, MenuItem
} from "@mui/material";
import { APIrequests } from "../../APIrequests";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import EmployeeReport from "./EmployeeReport";
import MonthSelector from "../common/MonthSelector";
import { useTranslation } from "react-i18next";
import i18n from "i18next";
import { formatCurrency } from "../../utils/formatters";
import ExcelJS from "exceljs";


const formatHours = (quantity) => {
  const q = parseFloat(quantity);
  if (isNaN(q)) return "";
  const hours = Math.floor(q);
  const minutes = Math.round((q - hours) * 60);
  let str = "";
  if (hours > 0) str += `${hours} ${i18n.t("specialUnits.hours")}`;
  if (minutes > 0) str += (hours > 0 ? ` ${i18n.t("employeeReport.and")} ` : "") + `${minutes} ${i18n.t("specialUnits.minutes")}`;
  if (!str) str = `0 ${i18n.t("specialUnits.minutes")}`;
  return str;
};

const EmployeesReport = () => {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [summary, setSummary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const { t, i18n } = useTranslation();
  const [selectedRole, setSelectedRole] = useState("");
  const api = new APIrequests();

  const filteredSummary = selectedRole
    ? summary.filter(emp => emp.role_name === selectedRole)
    : summary;

  const totalPayILS = filteredSummary
    .filter(e => e.currency === "ILS")
    .reduce((sum, e) => sum + Number(e.total), 0)
    .toFixed(2);

  const totalPayUSD = filteredSummary
    .filter(e => e.currency === "USD")
    .reduce((sum, e) => sum + Number(e.total), 0)
    .toFixed(2);


  const allUnits = ["hours", "characters", "pages", "items"];
  const summaryUnits = {};
  filteredSummary.forEach(entry => {
    const unit = entry.type === "hours" ? "hours" : entry.unit;
    const quantity = parseFloat(entry.quantity);
    if (!isNaN(quantity)) {
      summaryUnits[unit] = (summaryUnits[unit] || 0) + quantity;
    }
  });

  const existingUnits = allUnits.filter(unit => summaryUnits[unit]);
  const unitCells = [];
  for (let i = 0; i < 4; i++) {
    const unit = existingUnits[existingUnits.length - 1 - i];
    if (unit) {
      const quantity = summaryUnits[unit];
      unitCells.unshift(
        <TableCell key={unit} align="center">
          {unit === "hours"
            ? formatHours(quantity)
            : `${quantity.toLocaleString()} ${t(`specialUnits.${unit}`)}`}
        </TableCell>
      );
    } else {
      unitCells.unshift(<TableCell key={`empty-${i}`} />);
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const url = `/reports/monthly-summary/employees?month=${month}&year=${year}`;
        const data = await api.getRequest(url);
        setSummary(data);
      } catch (error) {
        console.error("שגיאה בטעינת הדוח:", error);
      }
      setLoading(false);
    };
    fetchData();
  }, [month, year]);

  const exportToExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Employees Report");

    const isRTL = i18n.language === "he";
    sheet.views = [{ rightToLeft: isRTL }];

    const monthName = new Date(year, month - 1).toLocaleString(i18n.language === "he" ? "he-IL" : "en-US", {
      month: "long",
      year: "numeric"
    });

    const title = `${t("employeeReport.title")} - ${monthName}`;
    sheet.mergeCells("A1", "F1");
    sheet.getCell("A1").value = title;
    sheet.getCell("A1").font = { size: 14, bold: true };
    sheet.getCell("A1").alignment = { horizontal: "center", vertical: "middle" };

    sheet.addRow([]);

    const headers = [
      t("employeesReport.employeeName"),
      t("employeesReport.employeeEmail"),
      t("employeesReport.role"),
      t("employeesReport.rate"),
      t("employeesReport.totalWork"),
      t("employeesReport.totalPayment"),
    ];
    sheet.addRow(headers).font = { bold: true };

    filteredSummary.forEach(emp => {
      const isHours = emp.type === "hours";
      const quantity = parseFloat(emp.quantity);
      const totalWork = isHours
        ? formatHours(quantity)
        : `${parseInt(emp.quantity)} ${t(`specialUnits.${emp.unit}`)}`;

      const totalPay = `${formatCurrency(emp.currency)} ${emp.total.toFixed(2)}`;

      const row = [
        emp.employee_name,
        emp.employee_email,
        t(`roles.${emp.role_name}`, emp.role_name),
        emp.rate,
        totalWork,
        totalPay
      ];
      sheet.addRow(row);
    });

    sheet.addRow([]);

    const summaryUnitsStr = allUnits
      .filter(unit => summaryUnits[unit])
      .map(unit => unit === "hours"
        ? formatHours(summaryUnits[unit])
        : `${summaryUnits[unit].toLocaleString()} ${t(`specialUnits.${unit}`)}`
      )
      .join(" | ");

    const summaryRow = [
      t("employeesReport.total"),
      "", "", "", summaryUnitsStr,
      `₪ ${totalPayILS}  |  $ ${totalPayUSD}`
    ];
    sheet.addRow(summaryRow).font = { bold: true };

    sheet.columns.forEach(column => {
      let maxLength = 0;
      column.eachCell({ includeEmpty: true }, cell => {
        const val = cell.value ? cell.value.toString() : "";
        maxLength = Math.max(maxLength, val.length);
      });
      column.width = maxLength + 4;
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    saveAs(blob, `${t("employeeReport.fileName")}_${month}_${year}.xlsx`);
  };


  if (selectedEmployee) {
    return (
      <EmployeeReport
        employeeId={selectedEmployee.employee_id}
        employeeName={selectedEmployee.employee_name}
        month={month}
        year={year}
        onBack={() => setSelectedEmployee(null)}
      />
    );
  }

  return (
    <Box mt={3} maxWidth={1000} mx="auto" dir={i18n.language === "he" ? "rtl" : "ltr"}>
      <Paper elevation={2} sx={{ p: 2 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <MonthSelector
            month={month}
            year={year}
            onChange={(newMonth, newYear) => {
              setMonth(newMonth);
              setYear(newYear);
            }}
          />
          <Box display="flex" gap={1}>
            <FormControl sx={{ minWidth: 160 }}>
              <InputLabel>{t("employeesReport.filterRole")}</InputLabel>
              <Select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
              >
                <MenuItem value="">{t("roles.All")}</MenuItem>
                {[...new Set(summary.map(emp => emp.role_name))].map(role => (
                  <MenuItem key={role} value={role}>
                    {t(`roles.${role}`)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button onClick={exportToExcel} variant="outlined" size="small">
              {t("employeesReport.downloadExcel")}
            </Button>
          </Box>
        </Box>

        {loading ? (
          <CircularProgress />
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>{t("employeesReport.employeeName")}</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>{t("employeesReport.employeeEmail")}</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>{t("employeesReport.role")}</TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>{t("employeesReport.rate")}</TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>{t("employeesReport.totalWork")}</TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>{t("employeesReport.totalPayment")}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredSummary.map((emp, i) => (
                <TableRow
                  key={i}
                  hover
                  sx={{ cursor: "pointer" }}
                  onClick={() => setSelectedEmployee(emp)}
                >
                  <TableCell>{emp.employee_name}</TableCell>
                  <TableCell>{emp.employee_email}</TableCell>
                  <TableCell>{t(`roles.${emp.role_name}`)}</TableCell>
                  <TableCell align="center">{emp.rate}</TableCell>
                  <TableCell align="center">
                    {emp.type === "hours"
                      ? formatHours(emp.quantity)
                      : `${parseInt(emp.quantity)} ${t(`specialUnits.${emp.unit}`)}`}
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      direction: i18n.language === "he" ? "rtl" : "ltr",
                      textAlign: "center",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {`${formatCurrency(emp.currency)} ${emp.total}`}
                  </TableCell>
                </TableRow>
              ))}
              <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                <TableCell sx={{ fontWeight: "bold" }}>{t("employeesReport.total")}</TableCell>
                {unitCells}
                {/* <TableCell align="center" sx={{ fontWeight: "bold" }}>{`${formatCurrency(filteredSummary[0]?.currency)} ${totalPay}`}</TableCell> */}
                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  {`₪ ${totalPayILS}  |  $ ${totalPayUSD}`}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        )}
      </Paper>
    </Box>
  );
};

export default EmployeesReport;
