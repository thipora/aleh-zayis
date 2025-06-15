import React, { useState, useEffect } from "react";
import {
  Box, Typography, Paper, Table, TableHead, TableRow,
  TableCell, TableBody, CircularProgress, Button
} from "@mui/material";
import { APIrequests } from "../../APIrequests.js";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { useTranslation } from "react-i18next";
import i18n from "i18next";
import { formatCurrency } from "../../utils/formatters";

const EmployeeReport = ({ employeeId, employeeName, month, year, onBack }) => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const api = new APIrequests();
  const { t } = useTranslation();
  const [monthlyCharges, setMonthlyCharges] = useState([]);
  const [employeeCurrency, setEmployeeCurrency] = useState("ILS");

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const url = `/reports/monthly-summary/employee/${employeeId}?month=${month}&year=${year}`;
        const data = await api.getRequest(url);
        setRows(data);
        if (data.length > 0) {
          setEmployeeCurrency(data[0].currency);
        }
        const charges = await api.getRequest(`/monthly-charges/${employeeId}`);
        setMonthlyCharges(charges);
      } catch (error) {
        console.error("Error fetching employee report:", error);
        setRows([]);
      }
      setLoading(false);
    };
    fetchReport();
  }, [employeeId, month, year]);

  const totalWorkPayment = rows.reduce((sum, row) => sum + Number(row.total), 0);
  const totalFixedCharges = monthlyCharges.reduce((sum, c) => sum + Number(c.amount), 0);
  const totalPayment = +(totalWorkPayment + totalFixedCharges).toFixed(2);

  const formatHours = (quantity) => {
    const q = parseFloat(quantity);
    if (isNaN(q)) return "";
    const hours = Math.floor(q);
    const minutes = Math.round((q - hours) * 60);
    let str = "";
    if (hours > 0) str += `${hours} ${t("employeeReport.hours")}`;
    if (minutes > 0) str += (hours > 0 ? ` ${t("employeeReport.and")} ` : "") + `${minutes} ${t("employeeReport.minutes")}`;
    if (!str) str = `0 ${t("employeeReport.minutes")}`;
    return str;
  };

  const exportToExcel = () => {
    const wsData = rows.map(row => ({
      [t("employeeReport.az")]: row.AZ_book_id,
      [t("employeeReport.project")]: row.book_name,
      [t("employeeReport.manager")]: row.projectManagerName,
      [t("employeeReport.amount")]: row.type === "hours"
        ? formatHours(row.quantity)
        : `${Math.floor(row.quantity)} ${t(`specialUnits.${row.unit}`, row.unit)}`,
      [t("employeeReport.rate")]: row.rate,
      // [t("employeeReport.totalPay")]: `${formatCurrency(employeeCurrency)} ${row.total.toFixed(2)}`
      [t("employeeReport.totalPay")]: `${formatCurrency(employeeCurrency)} ${(row.total ?? 0).toFixed(2)}`
    }));

    const summaryByUnit = {};
    rows.forEach(row => {
      const unit = row.type === "hours" ? "hours" : row.unit;
      const quantity = parseFloat(row.quantity);
      if (!isNaN(quantity)) {
        summaryByUnit[unit] = (summaryByUnit[unit] || 0) + quantity;
      }
    });

    monthlyCharges.forEach(charge => {
      wsData.push({
        [t("employeeReport.az")]: t("employeeReport.fixedPayments"),
        [t("employeeReport.project")]: "",
        [t("employeeReport.manager")]: "",
        [t("employeeReport.amount")]: "",
        [t("employeeReport.rate")]: charge.charge_name,
        // [t("employeeReport.totalPay")]: `${formatCurrency(employeeCurrency)} ${charge.amount}`
        [t("employeeReport.totalPay")]: `${formatCurrency(employeeCurrency)} ${(Number(charge.amount) || 0).toFixed(2)}`
      });
    });

    wsData.push({});

    wsData.push({
      [t("employeeReport.az")]: t("employeeReport.total"),
      [t("employeeReport.amount")]: Object.entries(summaryByUnit).map(([unit, val], idx) => (
        unit === "hours"
          ? formatHours(val)
          : `${val.toLocaleString()} ${t(`specialUnits.${unit}`)}`
      )).join(" | "),
      [t("employeeReport.totalPay")]: `${formatCurrency(employeeCurrency)} ${totalPayment.toFixed(2)}`
    });

    const worksheet = XLSX.utils.json_to_sheet(wsData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, t("employeeReport.sheetName"));
    const fileName = `${t("employeeReport.fileName")}_${employeeName}_${month}_${year}.xlsx`;
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([excelBuffer], { type: "application/octet-stream" }), fileName);
  };

  const summaryByUnit = {};
  rows.forEach(row => {
    const unit = row.type === "hours" ? "hours" : row.unit;
    const quantity = parseFloat(row.quantity);
    if (!isNaN(quantity)) {
      summaryByUnit[unit] = (summaryByUnit[unit] || 0) + quantity;
    }
  });

  return (
    <Box maxWidth={1000} mx="auto" mt={3} dir={i18n.language === "he" ? "rtl" : "ltr"}>
      <Button onClick={onBack} variant="text">⬅ {t("employeeReport.back")}</Button>
      <Typography variant="h6" gutterBottom>
        {t("employeeReport.title", { name: employeeName, month, year })}
      </Typography>
      <Button onClick={exportToExcel} variant="outlined" sx={{ mb: 2 }}>
        {t("employeeReport.download")}
      </Button>
      <Paper>
        {loading ? <CircularProgress /> : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t("employeeReport.az")}</TableCell>
                <TableCell>{t("employeeReport.project")}</TableCell>
                <TableCell>{t("employeeReport.manager")}</TableCell>
                <TableCell>{t("employeeReport.amount")}</TableCell>
                <TableCell>{t("employeeReport.rate")}</TableCell>
                <TableCell>{t("employeeReport.totalPay")}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row, idx) => (
                <TableRow key={idx}>
                  <TableCell>{row.AZ_book_id}</TableCell>
                  <TableCell>{row.book_name}</TableCell>
                  <TableCell>{row.projectManagerName}</TableCell>
                  <TableCell align="center">
                    {row.type === "hours"
                      ? formatHours(row.quantity)
                      : `${Math.floor(row.quantity)} ${t(`specialUnits.${row.unit}`, row.unit)}`}
                  </TableCell>
                  <TableCell>{row.rate}</TableCell>
                  <TableCell align="center">
                    {/* {formatCurrency(employeeCurrency)} {row.total.toFixed(2)} */}
                    {formatCurrency(employeeCurrency)} {row.total != null ? row.total.toFixed(2) : '0.00'}
                  </TableCell>
                </TableRow>
              ))}

              {monthlyCharges.map((charge, idx) => (
                <TableRow key={`charge-${idx}`}>
                  <TableCell sx={{ fontWeight: 'bold' }}>{t("employeeReport.fixedPayments")}</TableCell>
                  <TableCell colSpan={3} />
                  <TableCell>{charge.charge_name}</TableCell>
                  <TableCell>{formatCurrency(employeeCurrency)} {charge.amount}</TableCell>
                </TableRow>
              ))}

              <TableRow sx={{ backgroundColor: '#f0f0f0' }}>
                <TableCell sx={{ fontWeight: 'bold' }}>{t("employeeReport.total")}</TableCell>
                <TableCell colSpan={2} />
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                  {Object.entries(summaryByUnit).map(([unit, val], idx) => (
                    <span key={unit}>
                      {idx > 0 && " | "}
                      {unit === "hours"
                        ? formatHours(val)
                        : `${val.toLocaleString()} ${t(`specialUnits.${unit}`)}`}
                    </span>
                  ))}
                </TableCell>
                <TableCell />
                <TableCell sx={{ fontWeight: 'bold' }}>{formatCurrency(employeeCurrency)} {totalPayment}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        )}
      </Paper>
    </Box>
  );
};

export default EmployeeReport;
