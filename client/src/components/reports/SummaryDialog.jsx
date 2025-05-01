import React, { useState } from "react";
import DatePicker from "react-datepicker";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, CircularProgress, Box, Typography, Paper } from "@mui/material";
import { he } from 'date-fns/locale';
import MonthNavigator from "../common/MonthNavigator";

const SummaryDialog = ({
  open,
  type, // "month" or "book"
  options,
  selected,
  onSelect,
  onFetch,
  summary,
  loading,
  onClose,
  label,
}) => {
  // ניהול מצב פנימי לבחירת חודש
  const [pickerDate, setPickerDate] = useState(
    selected
      ? new Date(selected + "-01")
      : new Date()
  );

  // עדכון ה-selected בכל שינוי תאריך
  const handleChange = (date) => {
    setPickerDate(date);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    onSelect(`${year}-${month}`);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ bgcolor: "#ffe6ee", color: "#ab1259", fontWeight: 700 }}>
        {type === "month" ? "סיכום שעות לפי חודש" : "סיכום שעות לפי ספר"}
      </DialogTitle>
      <DialogContent>
        <Box my={2} display="flex" flexDirection="column" alignItems="center" gap={2}>
        {type === "month" ? (
  <Paper elevation={3} sx={{ p: 3, borderRadius: 3, boxShadow: "0 2px 16px #fce4ec" }}>
    <Typography variant="subtitle1" align="center" sx={{ mb: 2, fontWeight: 500 }}>
      בחרי חודש להצגת סיכום
    </Typography>
    <MonthNavigator
      value={selected}
      onChange={onSelect}
      minYear={2022} // תוכלי להגדיר גבולות אם צריך
      maxYear={new Date().getFullYear()}
    />
    <Button
      onClick={onFetch}
      disabled={!selected || loading}
      variant="contained"
      sx={{
        mt: 2,
        fontWeight: 700,
        bgcolor: "#e91e63",
        color: "#fff",
        borderRadius: 2,
        boxShadow: "0 2px 6px #f8bbd0",
        "&:hover": { bgcolor: "#ad1457" }
      }}
      fullWidth
    >
      הצג סיכום
    </Button>
  </Paper>

          ) : (
            <Paper elevation={3} sx={{ p: 3, borderRadius: 3, boxShadow: "0 2px 16px #fce4ec", width: "100%" }}>
              <Typography variant="subtitle1" align="center" sx={{ mb: 1, fontWeight: 500 }}>
                בחרי ספר להצגת סיכום
              </Typography>
              <Box display="flex" alignItems="center" gap={2} justifyContent="center">
                <select
                  value={selected}
                  onChange={e => onSelect(e.target.value)}
                  style={{
                    padding: "8px 14px",
                    borderRadius: "12px",
                    border: "1px solid #e91e63",
                    fontWeight: 500,
                    background: "#fff"
                  }}>
                  <option value="">{label || "בחר ספר"}</option>
                  {options.map(opt =>
                    <option
                      key={opt.book_id || opt.id}
                      value={opt.book_id || opt.id}>
                      {opt.book_name || opt.name}
                    </option>
                  )}
                </select>
                <Button
                  onClick={onFetch}
                  disabled={!selected || loading}
                  variant="contained"
                  sx={{
                    fontWeight: 700,
                    bgcolor: "#e91e63",
                    color: "#fff",
                    borderRadius: 2,
                    boxShadow: "0 2px 6px #f8bbd0",
                    "&:hover": { bgcolor: "#ad1457" }
                  }}
                >
                  הצג סיכום
                </Button>
              </Box>
            </Paper>
          )}
          {loading && <CircularProgress color="secondary" size={32} sx={{ mt: 3 }} />}
          {summary.length > 0 && (
            <Paper
              elevation={0}
              sx={{
                mt: 4, p: 2, borderRadius: 3, bgcolor: "#f8bbd0",
                width: "100%", overflowX: "auto"
              }}>
              <Typography variant="h6" align="center" sx={{ mb: 2, fontWeight: 700, color: "#c2185b" }}>
                תוצאות הסיכום
              </Typography>
              <table style={{ width: "100%", borderCollapse: "collapse", background: "#fff" }}>
                <thead>
                  <tr>
                    <th style={{ borderBottom: "2px solid #e91e63", padding: 10, color: "#c2185b", fontWeight: 700, background: "#fff0f6" }}>
                      {type === "month" ? "שם הספר" : "חודש"}
                    </th>
                    <th style={{ borderBottom: "2px solid #e91e63", padding: 10, color: "#c2185b", fontWeight: 700, background: "#fff0f6" }}>
                      שעות
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {summary.map((row, i) => (
                    <tr key={i} style={{ background: i % 2 === 0 ? "#fff" : "#fde4ec" }}>
                      <td style={{ padding: 10, borderBottom: "1px solid #f8bbd0", textAlign: "center" }}>
                        {type === "month" ? (row.book_name || row.book_id) : row.month}
                      </td>
                      <td style={{ padding: 10, borderBottom: "1px solid #f8bbd0", textAlign: "center" }}>
                        {row.total_hours}
                      </td>
                    </tr>
                  ))}
                  <tr style={{ background: "#fffde7" }}>
                    <td style={{ padding: 10, textAlign: "center", fontWeight: 700, color: "#ad1457" }}>סה"כ</td>
                    <td style={{ padding: 10, textAlign: "center", fontWeight: 700, color: "#ad1457" }}>
                      {summary.reduce((sum, r) => sum + Number(r.total_hours), 0)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </Paper>
          )}
        </Box>
      </DialogContent>
      <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            fontWeight: 600,
            color: "#c2185b",
            borderColor: "#c2185b",
            borderRadius: 2,
            px: 4,
            bgcolor: "#fff"
          }}>
          סגור
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SummaryDialog;
