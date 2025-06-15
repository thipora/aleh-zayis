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

  // totalsByRoleAndCurrency
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

  // totalsByCurrency (grand total)
  const totalsByCurrency = {};
  employees.forEach(emp => {
    if (!totalsByCurrency[emp.currency]) {
      totalsByCurrency[emp.currency] = 0;
    }
    totalsByCurrency[emp.currency] += emp.total;
  });

  return { roles, employees, totalsByRoleAndCurrency, totalsByCurrency };
}

const BookMatrixReport = ({ initialBookId, onBack }) => {
  const [bookIdInput, setBookIdInput] = useState(initialBookId || "");
  const [selectedBookId, setSelectedBookId] = useState(initialBookId || "");

  // const [bookIdInput, setBookIdInput] = useState("");
  // const [selectedBookId, setSelectedBookId] = useState("");
  const [matrixData, setMatrixData] = useState(null);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  const api = new APIrequests();

  useEffect(() => {
    const fetchReport = async () => {
      if (!selectedBookId) return;
      setLoading(true);
      try {
        const data = await api.getRequest(`/reports/book-summary/${selectedBookId}`);
        const transformed = transformToMatrix(data);
        setMatrixData(transformed);
      } catch (error) {
        console.error("Failed to load report", error);
      }
      setLoading(false);
    };
    fetchReport();
  }, [selectedBookId]);

  const handleSubmit = () => {
    if (bookIdInput.trim()) {
      setSelectedBookId(bookIdInput.trim());
    }
  };

  const exportToExcel = () => {
    if (!matrixData) return;

    const wsData = matrixData.employees.map(emp => {
      const row = {
        [t("bookMatrixReport.employeeName")]: emp.employee_name,
      };
      matrixData.roles.forEach(role => {
        row[t(`roles.${role}`, role)] = emp.roles[role]
          ? `${formatCurrency(emp.currency)} ${emp.roles[role].toFixed(2)}`
          : "";
      });
      row[t("bookMatrixReport.total")] = Object.entries(matrixData.totalsByCurrency).map(([currency, total], idx) => {
        if (emp.currency === currency) {
          return `${formatCurrency(currency)} ${emp.total.toFixed(2)}`;
        }
        return '';
      }).filter(str => str !== '').join(' | ');

      return row;
    });

    const totalRow = {
      [t("bookMatrixReport.employeeName")]: t("bookMatrixReport.totalByRole"),
    };

    matrixData.roles.forEach(role => {
      const roleSummaryStr = Object.entries(matrixData.totalsByRoleAndCurrency[role] || {}).map(
        ([currency, total], idx) => {
          return `${formatCurrency(currency)} ${total.toFixed(2)}`;
        }
      ).join(' | ');

      totalRow[t(`roles.${role}`, role)] = roleSummaryStr;
    });

    const totalSummaryStr = Object.entries(matrixData.totalsByCurrency).map(
      ([currency, total], idx) => {
        return `${formatCurrency(currency)} ${total.toFixed(2)}`;
      }
    ).join(' | ');

    totalRow[t("bookMatrixReport.total")] = totalSummaryStr;

    wsData.push({});
    wsData.push(totalRow);

    const worksheet = XLSX.utils.json_to_sheet(wsData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, t("bookMatrixReport.sheetName") || "Matrix Report");

    const fileName = `${t("bookMatrixReport.fileName") || "Matrix_Report"}_${selectedBookId}.xlsx`;
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([excelBuffer], { type: "application/octet-stream" }), fileName);
  };

  return (
    <Box mt={4} maxWidth={1200} mx="auto" dir={i18n.language === "he" ? "rtl" : "ltr"}>
      <Paper sx={{ p: 3 }}>

        {onBack && (
          <Button onClick={onBack} variant="text">⬅ {t("employeesReport.back")}</Button>
        )}


        <Typography variant="h5" gutterBottom>
          {t("bookMatrixReport.title")}
        </Typography>

        <Box display="flex" gap={2} mb={3}>
          <TextField
            label={t("bookMatrixReport.bookId")}
            value={bookIdInput}
            onChange={(e) => setBookIdInput(e.target.value)}
            fullWidth
          />
          <Button variant="contained" onClick={handleSubmit}>
            {t("bookMatrixReport.showReport")}
          </Button>
          {matrixData && (
            <Button onClick={exportToExcel} variant="outlined" sx={{ ml: 2 }}>
              {t("bookMatrixReport.downloadExcel")}
            </Button>
          )}
        </Box>

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