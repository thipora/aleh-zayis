import React, { useState, useEffect } from "react";
import { Box, TextField } from "@mui/material";
import { useTranslation } from "react-i18next";

const ManualInput = ({ onChange }) => {
  const { t } = useTranslation();
  const [hours, setHours] = useState("0");
  const [minutes, setMinutes] = useState("0");

  useEffect(() => {
    const h = Number(hours);
    const m = Number(minutes);

    if (!isNaN(h) && !isNaN(m) && h >= 0 && m >= 0 && m < 60) {
      const quantity = h + m / 60;
      onChange(Number(quantity.toFixed(3)));
    } else {
      onChange("");
    }
  }, [hours, minutes, onChange]);

  return (
    <Box display="flex" gap={2} mt={2}>
      <TextField
        label={t("AddWorkDialog.hours")}
        type="number"
        inputProps={{ min: 0 }}
        value={hours}
        onChange={(e) => setHours(e.target.value)}
        fullWidth
      />
      <TextField
        label={t("AddWorkDialog.minutes")}
        type="number"
        value={minutes}
        onChange={(e) => setMinutes(e.target.value)}
        fullWidth
      />
    </Box>
  );
};

export default ManualInput;
