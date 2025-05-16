import React from "react";
import { Box, Button, Typography } from "@mui/material";

const monthNames = [
  "ינואר", "פברואר", "מרץ", "אפריל", "מאי", "יוני",
  "יולי", "אוגוסט", "ספטמבר", "אוקטובר", "נובמבר", "דצמבר"
];

const MonthSelector = ({ month, year, onChange }) => {
  const handlePrevMonth = () => {
    if (month === 1) {
      onChange(12, year - 1);
    } else {
      onChange(month - 1, year);
    }
  };

  const handleNextMonth = () => {
    if (month === 12) {
      onChange(1, year + 1);
    } else {
      onChange(month + 1, year);
    }
  };

  return (
    <Box display="flex" alignItems="center" gap={1}>
      <Button onClick={handlePrevMonth} size="small">&lt;</Button>
      <Typography variant="subtitle1">
        {monthNames[month - 1]} {year}
      </Typography>
      <Button onClick={handleNextMonth} size="small">&gt;</Button>
    </Box>
  );
};

export default MonthSelector;
