import React, { useState, useEffect } from "react";
import { Box, TextField } from "@mui/material";
import { useTranslation } from "react-i18next";

const RangeInput = ({ onQuantityUpdate }) => {
  const { t } = useTranslation();
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  useEffect(() => {
    if (start && end && start < end) {
      const [startH, startM] = start.split(":").map(Number);
      const [endH, endM] = end.split(":").map(Number);
      const totalMinutes = (endH * 60 + endM) - (startH * 60 + startM);
      const hours = (totalMinutes / 60).toFixed(3);
      onQuantityUpdate(hours, start, end);
    }
  }, [start, end]);

  return (
    <Box display="flex" gap={2} mt={2}>
      <TextField
        label={t("AddWorkDialog.start")}
        type="time"
        value={start}
        onChange={(e) => setStart(e.target.value)}
        fullWidth
      />
      <TextField
        label={t("AddWorkDialog.end")}
        type="time"
        value={end}
        onChange={(e) => setEnd(e.target.value)}
        fullWidth
        InputLabelProps={{ shrink: true }}
      />
    </Box>
  );
};

export default RangeInput;
