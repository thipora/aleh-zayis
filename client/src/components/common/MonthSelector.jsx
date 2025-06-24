import { Box, Button, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

const MonthSelector = ({ month, year, onChange }) => {
  const { t, i18n } = useTranslation();
  const isHebrew = i18n.language === "he";

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

  const monthLabel = t(`MonthSelector.months.${month}`);
  const yearLabel = year;

  return (
    <Box
      display="flex"
      alignItems="center"
      gap={2}
      mt={2}
      mb={2}
      justifyContent="center"
      sx={{ direction: "ltr" }}
    >
      <Button onClick={isHebrew ? handleNextMonth : handlePrevMonth} size="small">
        ←
      </Button>

      <Typography variant="subtitle1" fontWeight="bold">
        {monthLabel} {yearLabel}
      </Typography>

      <Button onClick={isHebrew ? handlePrevMonth : handleNextMonth} size="small">
        →
      </Button>
    </Box>
  );
};

export default MonthSelector;

