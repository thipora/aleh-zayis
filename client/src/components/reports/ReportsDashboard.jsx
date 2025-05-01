import React, { useState } from "react";
import MonthlyEmployeesSummary from "./MonthlyEmployeesSummary";
import BookPivotReport from "./BookPivotReport";
import { Box, Button, Typography } from "@mui/material";

const ReportsDashboard = () => {
  const [report, setReport] = useState(null); // "employees" | "editors" | "books"

  const handleBack = () => setReport(null);

  return (
    <Box p={3} maxWidth={1000} mx="auto" dir="rtl">
      {!report && (
        <Box display="flex" flexDirection="column" gap={2} alignItems="center">
          <Typography variant="h5" gutterBottom>בחר דוח להצגה</Typography>
          <Button variant="contained" onClick={() => setReport("employees")} fullWidth>
            סיכום חודשי לפי עובדים (תשלומים)
          </Button>
          <Button variant="contained" onClick={() => setReport("books")} fullWidth>
            סיכום שעות לפי ספרים
          </Button>
        </Box>
      )}

      {report === "employees" && (
        <>
          <Button onClick={handleBack} sx={{ mt: 2 }}>⬅ חזור</Button>
          <MonthlyEmployeesSummary />
        </>
      )}
      {report === "books" && (
        <>
          <Button onClick={handleBack} sx={{ mt: 2 }}>⬅ חזור</Button>
          <BookPivotReport />
        </>
      )}
    </Box>
  );
};

export default ReportsDashboard;
