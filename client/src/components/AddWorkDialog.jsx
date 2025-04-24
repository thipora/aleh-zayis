import React, { useState, useEffect } from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, CircularProgress, MenuItem, Select, FormControl, InputLabel, Checkbox, FormControlLabel, FormHelperText } from "@mui/material";
import { APIrequests } from "../APIrequests";

const AddWorkDialog = ({ open, onClose, onAdd, books }) => {
  const [newWork, setNewWork] = useState({
    book_id: "",
    book_name: "", // הוספת שדה כותרת
    quantity: "",
    description: "",
    notes: "",
    date: new Date().toISOString().split("T")[0],
    specialWork: false
  });
  // const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [paymentType, setPaymentType] = useState("");
  const [specialPaymentType, setSpecialPaymentType] = useState("");
  const [roleName, setRoleName] = useState("");
  const [errors, setErrors] = useState({});
  const apiRequests = new APIrequests();

  useEffect(() => {
    const fetchBooksAndRole = async () => {
      try {
        const userData = localStorage.getItem("user");
        const user = JSON.parse(userData);

        // const booksData = bookData;
        // setBooks(booksData);
        // setPaymentType(roleData.data.payment_type);
        // setSpecialPaymentType(roleData.data.special_payment_type || null);
        // setRoleName(roleData.data.name);
        // setRoleName(prev => roleData.data.name || prev);
      } catch (error) {
        console.error("Error loading data", error);
      }
    };

    if (open) {
      fetchBooksAndRole();
    }
  }, [open]);

  const getSpecialWorkLabel = () => {
    switch(roleName) {
      case "Editor":
      case "Typist":
        return "Corrections";
      case "Proofreader":
        return "Vocalization";
      default:
        return "Other Work";
    }
  };
  


  // const handleInputChange = (e) => {
  //   const { name, value } = e.target;
  //   setNewWork(prevState => ({ ...prevState, [name]: value }));
  // };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // אם שדה זה book_id צריך להכניס גם title
    if (name === "book_id") {
      const selectedBook = books.find(book => book.id_book === value);
      setNewWork(prevState => ({
        ...prevState,
        book_id: value,
        book_name: selectedBook ? selectedBook.title : ""
      }));
    } else {
      setNewWork(prevState => ({ ...prevState, [name]: value }));
    }
  };
  

  const handleCheckboxChange = (e) => {
    setNewWork(prevState => ({ ...prevState, specialWork: e.target.checked }));
  };

  const handleSave = async () => {
    let newErrors = {};

    if (!newWork.book_id) newErrors.book_id = "This field is required";
    if (!newWork.quantity) newErrors.quantity = "This field is required";
    if (!newWork.description) newErrors.description = "This field is required";
    if (!newWork.date) newErrors.date = "This field is required";  // בדיקת תאריך

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setLoading(true);
      try {
        await onAdd(newWork); // שומר את העבודה
        onClose(); // סוגר את החלון
      } catch (error) {
        alert("There was an error adding the work. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add New Work</DialogTitle>
      <DialogContent>

        <FormControl fullWidth margin="normal" error={!!errors.book_id}>
          <InputLabel>Choose Book</InputLabel>
          <Select name="book_id" value={newWork.book_id} onChange={handleInputChange}>
            {books.map((book) => (
              <MenuItem key={book.id_book} value={book.id_book}>{book.title}</MenuItem>
            ))}
          </Select>
          {errors.book_id && <FormHelperText>{errors.book_id}</FormHelperText>}
        </FormControl>


        <TextField
          label={`Work Amount`}
          name="quantity"
          value={newWork.quantity}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
          type="number"
          error={!!errors.quantity}
          helperText={errors.quantity}
          sx={{
            "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button": {
              display: "none",
            },
            "& input[type=number]": {
              MozAppearance: "textfield",
            },
          }}
        />

        {specialPaymentType && (
          <FormControlLabel
            control={<Checkbox checked={newWork.specialWork} onChange={handleCheckboxChange} />}
            label={getSpecialWorkLabel()} // משתמשים בלוגיקה כאן כדי להציג את הכיתוב המתאים
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


        {/* {specialPaymentType && (
          <FormControlLabel
            control={<Checkbox checked={newWork.specialWork} onChange={handleCheckboxChange} />}
            label={getSpecialWorkLabel()} // משתמשים בלוגיקה כאן כדי להציג את הכיתוב המתאים
          />
        )} */}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">Cancel</Button>
        <Button onClick={handleSave} color="primary" disabled={loading}>
          {loading ? <CircularProgress size={24} color="secondary" /> : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddWorkDialog;
