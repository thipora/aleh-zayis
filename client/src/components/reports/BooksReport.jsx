import React, { useState, useEffect } from "react";
import {
  Box, Paper, Table, TableHead, TableRow,
  TableCell, TableBody, CircularProgress, Button, TextField
} from "@mui/material";
import { APIrequests } from "../../APIrequests";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import BookPivotReport from "./BookPivotReport";
import MonthSelector from "../common/MonthSelector";
import { useTranslation } from "react-i18next";
import i18n from "i18next";
import { formatCurrency } from "../../utils/formatters";

const BooksReport = () => {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
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
        const url = `/reports/monthly-summary/books?month=${month}&year=${year}`;
        const data = await api.getRequest(url);
        setSummary(data);
      } catch (error) {
        console.error("Error loading books summary:", error);
      }
      setLoading(false);
    };
    fetchData();
  }, [month, year]);

  const filteredSummary = summary.filter(book =>
    (book.book_name.toLowerCase().includes(searchText.toLowerCase()) ||
      book.AZ_book_id.toLowerCase().includes(searchText.toLowerCase())) &&
    book.projectManagerName.toLowerCase().includes(projectManagerSearch.toLowerCase())
  );

  const exportToExcel = () => {
    const wsData = filteredSummary.map(book => ({
      [t("booksReport.AZ_book_id")]: book.AZ_book_id,
      [t("booksReport.bookName")]: book.book_name,
      [t("booksReport.totalPayment")]: `${formatCurrency(book.currency)} ${(Number(book.total_payment) || 0).toFixed(2)}`
    }));

    const worksheet = XLSX.utils.json_to_sheet(wsData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, t("booksReport.title") || "Books Report");

    const fileName = `${t("booksReport.title")}_${month}_${year}.xlsx`;
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([excelBuffer], { type: "application/octet-stream" }), fileName);
  };

  if (selectedBook) {
    return (
      <BookPivotReport
        initialBookId={selectedBook.AZ_book_id}
        onBack={() => setSelectedBook(null)}
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
        </Box>

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
                <TableCell sx={{ fontWeight: "bold" }}>{t("booksReport.bookId")}</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>{t("booksReport.bookName")}</TableCell>
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
