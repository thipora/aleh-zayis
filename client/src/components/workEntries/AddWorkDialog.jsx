import React, { useState, useEffect } from "react";
import {
  Dialog, DialogActions, DialogContent, DialogTitle,
  TextField, Button, CircularProgress, MenuItem, Select,
  FormControl, InputLabel, Checkbox, FormControlLabel, FormHelperText, Box
} from "@mui/material";

const AddWorkDialog = ({ open, onClose, onAdd, books, role }) => {
  const [newWork, setNewWork] = useState({
    book_id: "",
    book_name: "",
    hours: "",
    minutes: "",
    start_time: "",
    end_time: "",
    description: "",
    notes: "",
    date: new Date().toISOString().split("T")[0],
    is_special_work: false,
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSpecialWork, setIsSpecialWork] = useState(false);
  const [quantity, setQuantity] = useState("");
  const [is_hourly_primary, set_is_hourly_primary] = useState(true);

  useEffect(() => {
    if (!open) {
      setNewWork({
        book_id: "",
        book_name: "",
        hours: "",
        minutes: "",
        start_time: "",
        end_time: "",
        description: "",
        notes: "",
        date: new Date().toISOString().split("T")[0],
      });
      setErrors({});
      setIsSpecialWork(false);
      setQuantity("");
      set_is_hourly_primary(role[0].is_hourly_primary === 0)
    }
  }, [open]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "book_id") {
      const selectedBook = books.find(book => book.id_book === value);
      setNewWork(prev => ({
        ...prev,
        book_id: value,
        book_name: selectedBook ? selectedBook.title : ""
      }));
    } else {
      setNewWork(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleCheckboxChange = (e) => {
    setIsSpecialWork(e.target.checked);
  };

  const handleSave = async () => {
    let newErrors = {};

    if (!newWork.book_id) newErrors.book_id = "This field is required";
    if (!newWork.description) newErrors.description = "This field is required";
    if (!newWork.date) newErrors.date = "This field is required";

    const isUsingTime =
      (role[0].is_hourly_primary === 1 && !isSpecialWork) ||
      (role[0].is_hourly_primary === 0 && isSpecialWork);

    if (isUsingTime) {
      if (!newWork.start_time || !newWork.end_time) {
        newErrors.start_time = "Start and end time are required";
      } else if (newWork.end_time < newWork.start_time) {
        newErrors.end_time = "End time must be after start time";
      }
    } else {
      if (!quantity) {
        newErrors.quantity = "This field is required";
      }
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setLoading(true);
      try {
        const totalMinutes =
          parseInt(newWork.hours || 0) * 60 + parseInt(newWork.minutes || 0);
        const hourQuantity = (totalMinutes / 60).toFixed(3);

        const dataToSend = {
          ...newWork,
          quantity: isUsingTime ? hourQuantity : quantity,
          hours: undefined,
          minutes: undefined
        };

        await onAdd(dataToSend);
        onClose();
      } catch (err) {
        alert("Error adding work entry.");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add Work Entry</DialogTitle>
      <DialogContent>
        <FormControl fullWidth margin="normal" error={!!errors.book_id}>
          <InputLabel>Choose Book</InputLabel>
          <Select name="book_id" value={newWork.book_id} onChange={handleInputChange}>
            {books.map(book => (
              <MenuItem key={book.id_book} value={book.id_book}>
                {book.AZ_book_id} - {book.title}
              </MenuItem>
            ))}
          </Select>
          {errors.book_id && <FormHelperText>{errors.book_id}</FormHelperText>}
        </FormControl>

        {/* עבודה מיוחדת - תיבת סימון */}
        {role[0].uses_special_quantity === 1 && (
          <FormControlLabel
            control={<Checkbox checked={isSpecialWork} onChange={handleCheckboxChange} />}
            // label="עבודה לפי שעות"
    label={
      role[0].is_hourly_primary
        ? `עבודה לפי ${role[0].special_unit}`
        : `עבודה לפי שעות`
    }
          />
        )}

        {/* שעת התחלה וסיום או כמות */}
        {(role[0].is_hourly_primary === 1 && !isSpecialWork) ||
        (role[0].is_hourly_primary === 0 && isSpecialWork) ? (
          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField label="Start Time" name="start_time" type="time" value={newWork.start_time} onChange={handleInputChange} fullWidth error={!!errors.start_time} />
            <TextField label="End Time" name="end_time" type="time" value={newWork.end_time} onChange={handleInputChange} fullWidth error={!!errors.end_time} helperText={errors.end_time} />
          </Box>
        ) : (
          <TextField
            label={role[0].special_unit || "Quantity"}
            type="text"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            fullWidth
            margin="normal"
            error={!!errors.quantity}
            helperText={errors.quantity}
          />
        )}

        <TextField
          label="Work Description"
          name="description"
          value={newWork.description || ""}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
          error={!!errors.description}
          helperText={errors.description}
        />

        <TextField
          label="Notes"
          name="notes"
          value={newWork.notes || ""}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />

        <TextField
          label="Date"
          name="date"
          type="date"
          value={newWork.date}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
          error={!!errors.date}
          helperText={errors.date}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">Cancel</Button>
        <Button onClick={handleSave} color="primary" disabled={loading}>
          {loading ? <CircularProgress size={24} /> : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddWorkDialog;
