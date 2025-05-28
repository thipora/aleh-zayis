import { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box } from "@mui/material";
import { useTranslation } from "react-i18next";


const CustomRate = ({ open, onClose, book, onSave }) => {
  const [customRate, setCustomRate] = useState("");
  const { t } = useTranslation();

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
      <DialogTitle>{t("customRate.title")}</DialogTitle>
      <DialogContent>
        <Box mt={1} display="flex" flexDirection="column" gap={2}>
          <TextField
            label={t("customRate.label")}
            type="number"
            value={customRate}
            onChange={(e) => setCustomRate(e.target.value)}
            fullWidth
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t("customRate.cancel")}</Button>
        <Button onClick={handleSave} color="primary" variant="contained">
          {t("customRate.save")}
        </Button>
      </DialogActions>
    </Dialog>
  );

};

export default CustomRate;
