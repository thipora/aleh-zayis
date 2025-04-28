// import React, { useState, useEffect } from "react";
// import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, CircularProgress, MenuItem, Select, FormControl, InputLabel, Checkbox, FormControlLabel, FormHelperText, Box, Typography } from "@mui/material";
// import { APIrequests } from "../APIrequests";

// const AddWorkDialog = ({ open, onClose, onAdd, books }) => {
//   const [newWork, setNewWork] = useState({
//     book_id: "",
//     book_name: "",
//     hours: "",
//     minutes: "",
//     description: "",
//     notes: "",
//     date: new Date().toISOString().split("T")[0],
//     specialWork: false
//   });
//   const [loading, setLoading] = useState(false);
//   const [paymentType, setPaymentType] = useState("");
//   const [specialPaymentType, setSpecialPaymentType] = useState("");
//   const [roleName, setRoleName] = useState("");
//   const [errors, setErrors] = useState({});
//   const apiRequests = new APIrequests();

//   useEffect(() => {
//     const fetchBooksAndRole = async () => {
//       try {
//         const userData = localStorage.getItem("user");
//         const user = JSON.parse(userData);
//         // אפשר להוסיף כאן שליפת תפקיד/שכר לפי הצורך
//       } catch (error) {
//         console.error("Error loading data", error);
//       }
//     };
//     if (open) {
//       fetchBooksAndRole();
//     }
//   }, [open]);

//   const getSpecialWorkLabel = () => {
//     switch(roleName) {
//       case "Editor":
//       case "Typist":
//         return "Corrections";
//       case "Proofreader":
//         return "Vocalization";
//       default:
//         return "Other Work";
//     }
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     if (name === "book_id") {
//       const selectedBook = books.find(book => book.id_book === value);
//       setNewWork(prevState => ({
//         ...prevState,
//         book_id: value,
//         book_name: selectedBook ? selectedBook.title : ""
//       }));
//     } else {
//       setNewWork(prevState => ({ ...prevState, [name]: value }));
//     }
//   };

//   const handleCheckboxChange = (e) => {
//     setNewWork(prevState => ({ ...prevState, specialWork: e.target.checked }));
//   };

//   const handleSave = async () => {
//     let newErrors = {};

//     // חובה: שדה ספר, שעות/דקות, תיאור, תאריך
//     if (!newWork.book_id) newErrors.book_id = "This field is required";
//     if (!newWork.hours && !newWork.minutes) newErrors.hours = "Enter hours or minutes";
//     if (newWork.minutes && (isNaN(newWork.minutes) || newWork.minutes < 0 || newWork.minutes > 59)) newErrors.minutes = "Minutes must be between 0 and 59";
//     if (!newWork.description) newErrors.description = "This field is required";
//     if (!newWork.date) newErrors.date = "This field is required";

//     setErrors(newErrors);

//     if (Object.keys(newErrors).length === 0) {
//       setLoading(true);
//       try {
//         // חישוב כמות שעות עשרונית
//         const totalMinutes = (parseInt(newWork.hours || 0) * 60) + parseInt(newWork.minutes || 0);
//         const quantity = (totalMinutes / 60).toFixed(2); // שעות עשרוניות מדוייקות

//         await onAdd({ ...newWork, quantity });
//         onClose();
//       } catch (error) {
//         alert("There was an error adding the work. Please try again.");
//       } finally {
//         setLoading(false);
//       }
//     }
//   };

//   return (
//     <Dialog open={open} onClose={onClose}>
//       <DialogTitle>Add New Work</DialogTitle>
//       <DialogContent>
//         <FormControl fullWidth margin="normal" error={!!errors.book_id}>
//           <InputLabel>Choose Book</InputLabel>
//           <Select name="book_id" value={newWork.book_id} onChange={handleInputChange}>
//             {books.map((book) => (
//               <MenuItem key={book.id_book} value={book.id_book}>{book.title}</MenuItem>
//             ))}
//           </Select>
//           {errors.book_id && <FormHelperText>{errors.book_id}</FormHelperText>}
//         </FormControl>

//         {/* Work Amount group */}
//         <Box sx={{ mt: 2, mb: 2, border: '1px solid #eee', borderRadius: 2, p: 2, background: '#f8f8fc' }}>
//           <Typography variant="subtitle2" sx={{ mb: 1, color: "#6c3483" }}>
//             Work Amount
//           </Typography>
//           <Box sx={{ display: 'flex', gap: 2 }}>
//             <TextField
//               label="Hours"
//               name="hours"
//               type="number"
//               value={newWork.hours}
//               onChange={handleInputChange}
//               inputProps={{ min: 0 }}
//               error={!!errors.hours}
//               helperText={errors.hours}
//               fullWidth
//             />
//             <TextField
//               label="Minutes"
//               name="minutes"
//               type="number"
//               value={newWork.minutes}
//               onChange={handleInputChange}
//               inputProps={{ min: 0, max: 59 }}
//               error={!!errors.minutes}
//               helperText={errors.minutes}
//               fullWidth
//             />
//           </Box>
//         </Box>

//         {specialPaymentType && (
//           <FormControlLabel
//             control={<Checkbox checked={newWork.specialWork} onChange={handleCheckboxChange} />}
//             label={getSpecialWorkLabel()}
//           />
//         )}

//         <TextField
//           label="Work Description"
//           name="description"
//           value={newWork.description || ""}
//           onChange={handleInputChange}
//           fullWidth
//           margin="normal"
//           error={!!errors.description}
//           helperText={errors.description}
//         />

//         <TextField
//           label="Notes"
//           name="notes"
//           value={newWork.notes || ""}
//           onChange={handleInputChange}
//           fullWidth
//           margin="normal"
//         />

//         <TextField
//           label="Date"
//           name="date"
//           type="date"
//           value={newWork.date}
//           onChange={handleInputChange}
//           fullWidth
//           margin="normal"
//           error={!!errors.date}
//           helperText={errors.date}
//         />
//       </DialogContent>
//       <DialogActions>
//         <Button onClick={onClose} color="secondary">Cancel</Button>
//         <Button onClick={handleSave} color="primary" disabled={loading}>
//           {loading ? <CircularProgress size={24} color="secondary" /> : 'Save'}
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// };

// export default AddWorkDialog;


import React, { useState, useEffect } from "react";
import {
  Dialog, DialogActions, DialogContent, DialogTitle,
  TextField, Button, CircularProgress, MenuItem, Select,
  FormControl, InputLabel, Checkbox, FormControlLabel, FormHelperText, Box, Typography
} from "@mui/material";
import { APIrequests } from "../APIrequests";

const AddWorkDialog = ({ open, onClose, onAdd, books }) => {
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
    specialWork: false
  });
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
        // אפשר להוסיף כאן שליפת תפקיד/שכר לפי הצורך
      } catch (error) {
        console.error("Error loading data", error);
      }
    };
    if (open) {
      fetchBooksAndRole();
    }
  }, [open]);

  const getSpecialWorkLabel = () => {
    switch (roleName) {
      case "Editor":
      case "Typist":
        return "Corrections";
      case "Proofreader":
        return "Vocalization";
      default:
        return "Other Work";
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
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

    // בדיקת חובה: ספר, שעות/דקות, תיאור, תאריך, שעות עבודה
    if (!newWork.book_id) newErrors.book_id = "This field is required";
    if (!newWork.hours && !newWork.minutes) newErrors.hours = "Enter hours or minutes";
    if (
      newWork.minutes &&
      (isNaN(newWork.minutes) || newWork.minutes < 0 || newWork.minutes > 59)
    ) newErrors.minutes = "Minutes must be between 0 and 59";
    if (!newWork.description) newErrors.description = "This field is required";
    if (!newWork.date) newErrors.date = "This field is required";
    // בדיקת שעת התחלה וסיום (לא חובה, אבל אפשר להוסיף)
    if (newWork.start_time && newWork.end_time && newWork.end_time < newWork.start_time)
      newErrors.end_time = "End time must be after start time";

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setLoading(true);
      try {
        // חישוב כמות שעות עשרונית
        const totalMinutes =
          parseInt(newWork.hours || 0) * 60 + parseInt(newWork.minutes || 0);
        const quantity = (totalMinutes / 60).toFixed(3); // שמור בדיוק עד דקה

        await onAdd({
          ...newWork,
          quantity, // תמיד עשרוני
          // שעות ודקות, למעקב פנימי (אפשר לא להעביר לשרת)
          hours: undefined,
          minutes: undefined
        });
        onClose();
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
              <MenuItem key={book.id_book} value={book.id_book}>
                {book.title}
              </MenuItem>
            ))}
          </Select>
          {errors.book_id && <FormHelperText>{errors.book_id}</FormHelperText>}
        </FormControl>

        {/* Work Amount group */}
        <Box sx={{ mt: 2, mb: 2, border: "1px solid #eee", borderRadius: 2, p: 2, background: "#f8f8fc" }}>
          <Typography variant="subtitle2" sx={{ mb: 1, color: "#6c3483" }}>
            Work Amount
          </Typography>
          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField
              label="Hours"
              name="hours"
              type="number"
              value={newWork.hours}
              onChange={handleInputChange}
              inputProps={{ min: 0 }}
              error={!!errors.hours}
              helperText={errors.hours}
              fullWidth
            />
            <TextField
              label="Minutes"
              name="minutes"
              type="number"
              value={newWork.minutes}
              onChange={handleInputChange}
              inputProps={{ min: 0, max: 59 }}
              error={!!errors.minutes}
              helperText={errors.minutes}
              fullWidth
            />
          </Box>
        </Box>

        {/* Work time range group */}
        <Box sx={{ mt: 1, mb: 2, border: "1px solid #eee", borderRadius: 2, p: 2, background: "#fafdff" }}>
          <Typography variant="subtitle2" sx={{ mb: 1, color: "#2874a6" }}>
            Work Time Range
          </Typography>
          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField
              label="Start Time"
              name="start_time"
              type="time"
              value={newWork.start_time || ""}
              onChange={handleInputChange}
              InputLabelProps={{ shrink: true }}
              inputProps={{ step: 300 }}
              fullWidth
              error={!!errors.start_time}
            />
            <TextField
              label="End Time"
              name="end_time"
              type="time"
              value={newWork.end_time || ""}
              onChange={handleInputChange}
              InputLabelProps={{ shrink: true }}
              inputProps={{ step: 300 }}
              fullWidth
              error={!!errors.end_time}
              helperText={errors.end_time}
            />
          </Box>
        </Box>

        {specialPaymentType && (
          <FormControlLabel
            control={<Checkbox checked={newWork.specialWork} onChange={handleCheckboxChange} />}
            label={getSpecialWorkLabel()}
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
          {loading ? <CircularProgress size={24} color="secondary" /> : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddWorkDialog;