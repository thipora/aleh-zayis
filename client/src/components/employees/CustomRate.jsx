import React, { useState, useEffect } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, MenuItem, FormControl, InputLabel, Select, Box
} from "@mui/material";

const CustomRate = ({ open, onClose, book, onSave }) => {
  const [customRate, setCustomRate] = useState("");

  useEffect(() => {
    if (book) {
      setCustomRate(book.custom_rate || "");
    }
  }, [book]);

  const handleSave = () => {
    onSave({
      id_book_assignment: book.id_book_assignment,
      custom_rate: parseFloat(customRate),
    });
  };
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>עריכת תשלום מותאם</DialogTitle>
      <DialogContent>
        <Box mt={1} display="flex" flexDirection="column" gap={2}>
          <TextField
            label="Custom Rate"
            type="number"
            value={customRate}
            onChange={(e) => setCustomRate(e.target.value)}
            fullWidth
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>ביטול</Button>
        <Button onClick={handleSave} color="primary" variant="contained">שמור</Button>
      </DialogActions>
    </Dialog>
  );
};

export default CustomRate;
