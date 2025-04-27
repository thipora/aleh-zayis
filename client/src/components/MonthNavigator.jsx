// MonthNavigator.jsx
import React, { useState, useEffect } from "react";
import { Box, Typography, IconButton } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

// שמות החודשים בעברית
const months = [
  "ינואר", "פברואר", "מרץ", "אפריל", "מאי", "יוני",
  "יולי", "אוגוסט", "ספטמבר", "אוקטובר", "נובמבר", "דצמבר"
];

const MonthNavigator = ({ value, onChange, minYear = 2022, maxYear = new Date().getFullYear() }) => {
  // ערך התחלתי - מה־props או מהיום
  const [year, setYear] = useState(value ? Number(value.split("-")[0]) : new Date().getFullYear());
  const [month, setMonth] = useState(value ? Number(value.split("-")[1]) : new Date().getMonth() + 1);

  // שמירה על סנכרון חיצוני
  useEffect(() => {
    if (value) {
      setYear(Number(value.split("-")[0]));
      setMonth(Number(value.split("-")[1]));
    }
  }, [value]);

  // מעבר לחודש קודם/הבא
  const handlePrev = () => {
    if (month === 1) {
      setYear(prev => prev - 1);
      setMonth(12);
      onChange(`${year - 1}-${"12"}`);
    } else {
      setMonth(prev => prev - 1);
      onChange(`${year}-${String(month - 1).padStart(2, "0")}`);
    }
  };

  const handleNext = () => {
    if (month === 12) {
      setYear(prev => prev + 1);
      setMonth(1);
      onChange(`${year + 1}-01`);
    } else {
      setMonth(prev => prev + 1);
      onChange(`${year}-${String(month + 1).padStart(2, "0")}`);
    }
  };

  // מגבלות – לא לאפשר לעבור מעבר לגבולות
  const isMin = year === minYear && month === 1;
  const isMax = year === maxYear && month === 12;

  return (
    <Box display="flex" alignItems="center" justifyContent="center" gap={2}>
      <IconButton onClick={handlePrev} disabled={isMin} aria-label="הקודם">
        <ArrowBackIosNewIcon />
      </IconButton>
      <Typography variant="h6" sx={{ minWidth: 120, textAlign: "center", fontWeight: 700 }}>
        {months[month - 1]} {year}
      </Typography>
      <IconButton onClick={handleNext} disabled={isMax} aria-label="הבא">
        <ArrowForwardIosIcon />
      </IconButton>
    </Box>
  );
};

export default MonthNavigator;
