import React, { useState, useEffect } from "react";
import {
  Box, Paper, Table, TableHead, TableRow,
  TableCell, TableBody, CircularProgress, Button, TextField
} from "@mui/material";
import { APIrequests } from "../../APIrequests";
import BookPivotReport from "./BookPivotReport";
import MonthSelector from "../common/MonthSelector";
import { useTranslation } from "react-i18next";
import i18n from "i18next";
import { formatCurrency } from "../../utils/formatters";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

const BooksReport = ({ isMonthly = false }) => {
  const now = new Date();
  const [year, setYear] = useState(isMonthly ? now.getFullYear() : null);
  const [month, setMonth] = useState(isMonthly ? now.getMonth() + 1 : null);
  const [summary, setSummary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBook, setSelectedBook] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [projectManagerSearch, setProjectManagerSearch] = useState("");
  const { t, i18n } = useTranslation();
  const api = new APIrequests();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        let url = `/reports/books-summary`;
        if (isMonthly && month && year) {
          url += `?month=${month}&year=${year}`;
        }
        const data = await api.getRequest(url);
        setSummary(data);
      } catch (error) {
        console.error("Error loading books summary:", error);
      }
      setLoading(false);
    };
    fetchData();
  }, [month, year]);

  const safeLower = (val) => (val || "").toLowerCase();

  const filteredSummary = summary.filter(book =>
    (safeLower(book.book_name).includes(safeLower(searchText)) ||
      safeLower(book.AZ_book_id).includes(safeLower(searchText))) &&
    safeLower(book.projectManagerName).includes(safeLower(projectManagerSearch))
  );

  const exportToExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(t("booksReport.title") || "Books Report");

    const isRTL = i18n.language === "he";
    worksheet.views = [{ rightToLeft: isRTL }];

    const date = new Date(year, month - 1);
    const monthName = date.toLocaleString(isRTL ? "he-IL" : "en-US", {
      month: "long",
      year: "numeric"
    });

    let titleText;
    if (isMonthly) {
      titleText = `${t("booksReport.title")} - ${monthName}`;
    } else {
      titleText = t("booksReport.title");
    }
    worksheet.mergeCells("A1:D1");
    worksheet.getCell("A1").value = titleText;
    worksheet.getCell("A1").font = { bold: true, size: 14 };
    worksheet.getCell("A1").alignment = { horizontal: "center", vertical: "middle" };

    const headers =
      [
        t("booksReport.AZ"),
        t("booksReport.bookName"),
        t("booksReport.projectManager"),
        t("booksReport.totalPayment"),
      ];

    const headerRow = worksheet.addRow(headers);
    headerRow.font = { bold: true };
    headerRow.alignment = { horizontal: "center" };

    filteredSummary.forEach((book) => {
      const row = isRTL
        ? [
          `${formatCurrency(book.currency)} ${(Number(book.total_payment) || 0).toFixed(2)}`,
          book.projectManagerName,
          book.book_name,
          book.AZ_book_id,
        ]
        : [
          book.AZ_book_id,
          book.book_name,
          book.projectManagerName,
          `${formatCurrency(book.currency)} ${(Number(book.total_payment) || 0).toFixed(2)}`
        ];
      worksheet.addRow(row);
    });

    worksheet.columns.forEach((column) => {
      let maxLength = 0;
      column.eachCell?.({ includeEmpty: true }, (cell) => {
        const val = cell.value ? cell.value.toString() : "";
        if (val.length > maxLength) maxLength = val.length;
      });
      column.width = maxLength + 4;
    });

    let fileName;
    if (isMonthly) {
      fileName = `${t("booksReport.title")} ${monthName}.xlsx`;
    } else {
      fileName = `${t("booksReport.title")}.xlsx`;
    }
    let totalILS = 0;
    let totalUSD = 0;

    filteredSummary.forEach((book) => {
      const amount = Number(book.total_payment) || 0;
      const currency = book.currency?.toUpperCase();

      if (currency === "ILS") {
        totalILS += amount;
      } else if (currency === "USD") {
        totalUSD += amount;
      }
    });

    const summaryText = `${formatCurrency("ILS")} ${totalILS.toFixed(2)} | ${formatCurrency("USD")} ${totalUSD.toFixed(2)}`;
    const summaryRow = worksheet.addRow([summaryText]);

    worksheet.mergeCells(`A${summaryRow.number}:D${summaryRow.number}`);
    summaryRow.getCell(1).font = { bold: true };
    summaryRow.getCell(1).alignment = { horizontal: "center" };

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    });
    saveAs(blob, fileName);
  };

  if (selectedBook) {
    return (
      <BookPivotReport
        initialBook={selectedBook}
        onBack={() => setSelectedBook(null)}
        month={month ? month : null}
        year={year ? year : null}
        isMonthly={isMonthly}
      />
    );
  }

  return (
    <Box mt={3} maxWidth={1000} mx="auto" dir={i18n.language === "he" ? "rtl" : "ltr"}>
      <Paper elevation={2} sx={{ p: 2 }}>
        {isMonthly && (
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <MonthSelector
              month={month}
              year={year}
              onChange={(newMonth, newYear) => {
                setMonth(newMonth);
                setYear(newYear);
              }}
            />
          </Box>
        )}

        <Box display="flex" gap={2} mb={2}>
          <TextField
            label={t("booksReport.search")}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            size="small"
            fullWidth
          />
          <Button onClick={exportToExcel} variant="outlined" size="small">
            {t("booksReport.downloadExcel")}
          </Button>
        </Box>
        {loading ? (
          <CircularProgress />
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>{t("booksReport.AZ")}</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>{t("booksReport.bookName")}</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>{t("booksReport.projectManager")}</TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>{t("booksReport.totalPayment")}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredSummary.map((book, i) => (
                <TableRow
                  key={i}
                  hover
                  sx={{ cursor: "pointer" }}
                  onClick={() => setSelectedBook(book)}
                >
                  <TableCell>{book.AZ_book_id}</TableCell>
                  <TableCell>{book.book_name}</TableCell>
                  <TableCell>{book.projectManagerName}</TableCell>
                  <TableCell align="center">
                    {formatCurrency(book.currency)} {(Number(book.total_payment) || 0).toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Paper>
    </Box>
  );
};

export default BooksReport;
