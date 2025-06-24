
import React, { useState } from "react";
import {
  Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, Typography, Button
} from "@mui/material";
import UpdateWorkDialog from "./UpdateWorkDialog";
import { useTranslation } from "react-i18next";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import i18n from "i18next";


function useDurationFormatter() {
  const { t } = useTranslation();

  return (quantity) => {
    if (typeof quantity !== "number" && typeof quantity !== "string") return "";
    const q = parseFloat(quantity);
    if (isNaN(q)) return "";
    const hours = Math.floor(q);
    const minutes = Math.round((q - hours) * 60);
    let parts = [];

    if (hours > 0) parts.push(`${hours} ${t("duration.hours")}`);
    if (minutes > 0) parts.push(`${minutes} ${t("duration.minutes")}`);
    if (parts.length === 0) return `0 ${t("duration.minutes")}`;

    return parts.join(` ${t("duration.and")} `);
  };
}

const exportToExcel = async (entries, t, formatDuration, employeeName, month, year, currency) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Work Entries");

  const isRTL = i18n.language === "he";
  worksheet.views = [{ rightToLeft: isRTL }];

  const date = new Date(year, month - 1);
  const monthName = date.toLocaleString(i18n.language === "he" ? "he-IL" : "en-US", {
    month: "long",
    year: "numeric"
  });

  const titleText = `${t("workEntries.reportTitle")} – ${employeeName || t("workEntries.employee")} – ${monthName}`;
  worksheet.mergeCells("A1:H1");
  worksheet.getCell("A1").value = titleText;
  worksheet.getCell("A1").font = { bold: true, size: 14 };
  worksheet.getCell("A1").alignment = { horizontal: "center", vertical: "middle" };

  worksheet.addRow([]);

  const headerRow = worksheet.addRow([
    t("workEntries.date"),
    t("workEntries.azId"),
    t("workEntries.bookTitle"),
    t("workEntries.projectManager"),
    t("workEntries.workAmount"),
    t("workEntries.timeRange"),
    t("workEntries.description"),
    t("workEntries.notes")
  ]);

  worksheet.addRow([]);

  headerRow.eachCell((cell) => {
    cell.font = { bold: true };
  });

  worksheet.columns = [
    { key: "date", width: 15 },
    { key: "azId", width: 15 },
    { key: "bookTitle", width: 25 },
    { key: "projectManager", width: 20 },
    { key: "workAmount", width: 20 },
    { key: "timeRange", width: 20 },
    { key: "description", width: 30 },
    { key: "notes", width: 25 },
  ];

  entries.forEach((entry) => {
    const workAmount = entry.is_special_work
      ? `${entry.special_unit} ${parseInt(entry.quantity)}`
      : formatDuration(entry.quantity);

    const timeRange = !entry.is_special_work
      ? `${entry.start_time?.slice(0, 5)} - ${entry.end_time?.slice(0, 5)}`
      : "";

    worksheet.addRow([
      new Date(entry.date).toLocaleDateString(),
      entry.AZ_book_id,
      entry.book_name,
      entry.project_manager_name || "",
      workAmount,
      timeRange,
      entry.description,
      entry.notes
    ]);
  });

  const currencyLabel = `${t("workEntries.currency")}: ${currency}`;
  worksheet.mergeCells(`A${worksheet.lastRow.number + 1}:H${worksheet.lastRow.number + 1}`);
  worksheet.addRow([currencyLabel]);
  worksheet.lastRow.getCell(1).font = { italic: true };

  const buffer = await workbook.xlsx.writeBuffer();

  const safeName = (employeeName || "employee").replace(/\s+/g, "_");
  const fileName = `${safeName}_${month}_${year}_work_report.xlsx`;

  saveAs(new Blob([buffer]), fileName);
};




const WorkEntries = ({ workEntries, onUpdate, month, year, employeeName, onMonthChange, allowUpdate = true, currency }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedWork, setSelectedWork] = useState(null);
  const { t } = useTranslation();
  const formatDuration = useDurationFormatter();

  const handleUpdate = (log) => {
    setSelectedWork(log);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedWork(null);
  };

  const isToday = (dateString) => {
    const entryDate = new Date(dateString);
    const today = new Date();

    return (
      entryDate.getFullYear() === today.getFullYear() &&
      entryDate.getMonth() === today.getMonth() &&
      entryDate.getDate() === today.getDate()
    );
  };

  return (
    <div>

      <Button
        variant="contained"
        color="success"
        sx={{ mb: 2 }}
        onClick={() => exportToExcel(workEntries, t, formatDuration, employeeName, month, year, currency)}
      >
        {t("workEntries.exportExcel")}
      </Button>
      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <Typography variant="subtitle1" fontWeight="bold">{t("workEntries.date")}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle1" fontWeight="bold">{t("workEntries.azId")}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle1" fontWeight="bold">{t("workEntries.bookTitle")}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle1" fontWeight="bold">{t("workEntries.projectManager")}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle1" fontWeight="bold">{t("workEntries.workAmount")}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle1" fontWeight="bold">{t("workEntries.timeRange")}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle1" fontWeight="bold">{t("workEntries.description")}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle1" fontWeight="bold">{t("workEntries.notes")}</Typography>
              </TableCell>
              {allowUpdate && (
                <TableCell>
                  <Typography variant="subtitle1" fontWeight="bold">{t("workEntries.update")}</Typography>
                </TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {workEntries.map((log) => (
              <TableRow key={log.id_work_entries}>
                <TableCell>{new Date(log.date).toLocaleDateString()}</TableCell>
                <TableCell>{log.AZ_book_id}</TableCell>
                <TableCell>{log.book_name}</TableCell>
                <TableCell>{log.project_manager_name || ''}</TableCell>
                <TableCell>
                  {log.is_special_work
                    ? `${log.special_unit} ${parseInt(log.quantity)}`
                    : `${formatDuration(log.quantity)}`}
                </TableCell>
                <TableCell>
                  {!log.is_special_work
                    ? `${log.start_time.slice(0, 5)} - ${log.end_time.slice(0, 5)}`
                    : ""}
                </TableCell>
                <TableCell>{log.description}</TableCell>
                <TableCell>{log.notes}</TableCell>
                <TableCell>
                  {allowUpdate && (
                    <Button
                      size="small"
                      variant="outlined"
                      color="primary"
                      onClick={() => handleUpdate(log)}
                      disabled={!isToday(log.date)}
                    >
                      {t("workEntries.update")}
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {selectedWork && (
        <UpdateWorkDialog
          open={openDialog}
          onClose={handleCloseDialog}
          workData={selectedWork}
          onUpdate={onUpdate}
        />
      )}
    </div>
  );

};

export default WorkEntries; 
