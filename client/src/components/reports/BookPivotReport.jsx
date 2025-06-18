import React, { useEffect, useState } from "react";
import {
  Box, Typography, Paper, CircularProgress, Table,
  TableBody, TableCell, TableHead, TableRow,
  TextField, Button
} from "@mui/material";
import { APIrequests } from "../../APIrequests";
import { useTranslation } from "react-i18next";
import i18n from "i18next";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { formatCurrency } from "../../utils/formatters";
import ExcelJS from "exceljs";
import MonthSelector from "../common/MonthSelector";

function transformToMatrix(dataFromServer) {
  const employeeMap = {};
  const rolesSet = new Set();

  dataFromServer.forEach(({ role_name, employees }) => {
    rolesSet.add(role_name);
    employees.forEach(emp => {
      if (!employeeMap[emp.employee_id]) {
        employeeMap[emp.employee_id] = {
          employee_id: emp.employee_id,
          employee_name: emp.employee_name,
          currency: emp.currency,
          roles: {}
        };
      }
      employeeMap[emp.employee_id].roles[role_name] = emp.total;
    });
  });

  const roles = Array.from(rolesSet);
  const employees = Object.values(employeeMap);

  employees.forEach(emp => {
    emp.total = roles.reduce((sum, role) => sum + (emp.roles[role] || 0), 0);
  });

  const totalsByRoleAndCurrency = {};
  roles.forEach(role => {
    totalsByRoleAndCurrency[role] = {};
    employees.forEach(emp => {
      const amount = emp.roles[role] || 0;
      if (amount > 0) {
        if (!totalsByRoleAndCurrency[role][emp.currency]) {
          totalsByRoleAndCurrency[role][emp.currency] = 0;
        }
        totalsByRoleAndCurrency[role][emp.currency] += amount;
      }
    });
  });

  const totalsByCurrency = {};
  employees.forEach(emp => {
    if (!totalsByCurrency[emp.currency]) {
      totalsByCurrency[emp.currency] = 0;
    }
    totalsByCurrency[emp.currency] += emp.total;
  });

  return { roles, employees, totalsByRoleAndCurrency, totalsByCurrency };
}

const BookMatrixReport = ({ initialBook, onBack, month, year, isMonthly = false }) => {
  const isRTL = i18n.language === "he";
  const [myMonth, setMonth] = useState(month);
  const [myYear, setYear] = useState(year);
  const date = new Date(myYear, myMonth - 1);
  const monthName = date.toLocaleString(isRTL ? "he-IL" : "en-US", {
    month: "long",
    year: "numeric"
  });

  const [selectedBookId] = useState(initialBook?.AZ_book_id || "");
  const [bookInfo] = useState({
    azId: initialBook?.AZ_book_id || "",
    title: initialBook?.book_name || "",
    projectManager: initialBook?.projectManagerName || ""
  });

  const [matrixData, setMatrixData] = useState(null);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const api = new APIrequests();

  useEffect(() => {
    const fetchReport = async () => {
      if (!selectedBookId) return;
      setLoading(true);
      try {
        let url = `/reports/book-summary/${selectedBookId}`;
        if (isMonthly && myMonth && myYear) {
          url += `?month=${myMonth}&year=${myYear}`;
        }
        const data = await api.getRequest(url);
        const transformed = transformToMatrix(data);
        setMatrixData(transformed);
      } catch (error) {
        console.error("Failed to load report", error);
      }
      setLoading(false);
    };
    fetchReport();
  }, [selectedBookId, myMonth, myYear, isMonthly]);

  const exportToExcel = async () => {
    const isRTL = i18n.language === "he";
    if (!matrixData) return;

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Matrix Report");

    sheet.views = [{ rightToLeft: isRTL }];

    const roles = matrixData.roles;

    sheet.mergeCells("A1", String.fromCharCode(65 + roles.length + 1) + "1");
    sheet.getCell("A1").value = `${bookInfo.title} ${bookInfo.azId}`;
    sheet.getCell("A1").font = { size: 14, bold: true };
    sheet.getCell("A1").alignment = { horizontal: "center", vertical: "middle" };

    sheet.mergeCells("A2", String.fromCharCode(65 + roles.length + 1) + "2");
    sheet.getCell("A2").value = `${t("booksReport.projectManager")}: ${bookInfo.projectManager}`;
    sheet.getCell("A2").alignment = { horizontal: "center" };

    sheet.addRow([]);

    const header = [t("bookMatrixReport.employeeName"), ...roles.map(role => t(`roles.${role}`, role)), t("bookMatrixReport.total")];
    sheet.addRow(header).font = { bold: true };

    matrixData.employees.forEach(emp => {
      const row = [emp.employee_name];
      roles.forEach(role => {
        const val = emp.roles[role]
          ? `${formatCurrency(emp.currency)} ${emp.roles[role].toFixed(2)}`
          : "";
        row.push(val);
      });
      row.push(`${formatCurrency(emp.currency)} ${emp.total.toFixed(2)}`);
      sheet.addRow(row);
    });

    sheet.addRow([]);

    const totalRow = [t("bookMatrixReport.totalByRole")];
    roles.forEach(role => {
      const sums = Object.entries(matrixData.totalsByRoleAndCurrency[role] || {}).map(
        ([currency, total]) => `${formatCurrency(currency)} ${total.toFixed(2)}`
      );
      totalRow.push(sums.join(" | "));
    });
    const totalSums = Object.entries(matrixData.totalsByCurrency).map(
      ([currency, total]) => `${formatCurrency(currency)} ${total.toFixed(2)}`
    );
    totalRow.push(totalSums.join(" | "));
    sheet.addRow(totalRow).font = { bold: true };

    sheet.columns.forEach(column => {
      let maxLength = 0;
      column.eachCell({ includeEmpty: true }, cell => {
        const cellValue = cell.value ? cell.value.toString() : "";
        maxLength = Math.max(maxLength, cellValue.length);
      });
      column.width = maxLength + 4;
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    let fileName = `${t("bookMatrixReport.fileName")} ${selectedBookId}`;
    if (isMonthly) {
      fileName += ` ${monthName}`;
    }
    saveAs(blob, `${fileName}.xlsx`);
  };

  return (
    <Box mt={4} maxWidth={1200} mx="auto" dir={i18n.language === "he" ? "rtl" : "ltr"}>
      <Paper sx={{ p: 3 }}>
        {onBack && (
          <Button onClick={onBack} variant="text">⬅ {t("employeesReport.back")}</Button>
        )}

        {isMonthly && (
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <MonthSelector
              month={myMonth}
              year={myYear}
              onChange={(newMonth, newYear) => {
                setMonth(newMonth);
                setYear(newYear);
              }}
            />
          </Box>
        )}

        {matrixData && (
          <>
            <Box mb={2}>
              <Button onClick={exportToExcel} variant="outlined">
                {t("bookMatrixReport.downloadExcel")}
              </Button>
            </Box>
            <Box mb={3} sx={{ textAlign: "center" }}>
              <Typography variant="h6">{bookInfo.title} - {bookInfo.azId}</Typography>
              <Typography variant="subtitle1">
                {t("booksReport.projectManager")}: {bookInfo.projectManager}
              </Typography>
            </Box>
          </>
        )}

        {loading ? (
          <CircularProgress />
        ) : (
          matrixData && (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}>
                    {t("bookMatrixReport.employeeName")}
                  </TableCell>
                  {matrixData.roles.map(role => (
                    <TableCell key={role} align="center" sx={{ fontWeight: "bold" }}>
                      {t(`roles.${role}`, role)}
                    </TableCell>
                  ))}
                  <TableCell align="center" sx={{ fontWeight: "bold" }}>
                    {t("bookMatrixReport.total")}
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {matrixData.employees.map((emp, i) => (
                  <TableRow key={i}>
                    <TableCell>{emp.employee_name}</TableCell>
                    {matrixData.roles.map(role => (
                      <TableCell key={role} align="center">
                        {emp.roles[role]
                          ? `${formatCurrency(emp.currency)} ${emp.roles[role].toFixed(2)}`
                          : ""}
                      </TableCell>
                    ))}
                    <TableCell align="center">
                      <strong>{formatCurrency(emp.currency)} {emp.total.toFixed(2)}</strong>
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                  <TableCell sx={{ fontWeight: "bold" }}>
                    {t("bookMatrixReport.totalByRole")}
                  </TableCell>
                  {matrixData.roles.map(role => (
                    <TableCell key={role} align="center" sx={{ fontWeight: "bold" }}>
                      {Object.entries(matrixData.totalsByRoleAndCurrency[role] || {}).map(
                        ([currency, total], idx) => (
                          <span key={currency}>
                            {idx > 0 && " | "}
                            {formatCurrency(currency)} {total.toFixed(2)}
                          </span>
                        )
                      )}
                    </TableCell>
                  ))}
                  <TableCell align="center" sx={{ fontWeight: "bold" }}>
                    {Object.entries(matrixData.totalsByCurrency).map(([currency, total], idx) => (
                      <span key={currency}>
                        {idx > 0 && " | "}
                        {formatCurrency(currency)} {total.toFixed(2)}
                      </span>
                    ))}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          )
        )}
      </Paper>
    </Box>
  );
};

export default BookMatrixReport;
