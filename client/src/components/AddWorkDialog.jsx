// import React, { useState, useEffect } from "react";
// import {
//   Dialog, DialogActions, DialogContent, DialogTitle,
//   TextField, Button, CircularProgress, MenuItem, Select,
//   FormControl, InputLabel, Checkbox, FormControlLabel, FormHelperText, Box, Typography
// } from "@mui/material";
// import { APIrequests } from "../APIrequests";

// const AddWorkDialog = ({ open, onClose, onAdd, books }) => {
//   const [newWork, setNewWork] = useState({
//     book_id: "",
//     book_name: "",
//     hours: "",
//     minutes: "",
//     start_time: "",
//     end_time: "",
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
//   const [role, setRole] = useState(null);
// const [isSpecialWork, setIsSpecialWork] = useState(false);
// const [quantity, setQuantity] = useState("");

//   const apiRequests = new APIrequests();
  

//   // useEffect(() => {
//   //   const fetchBooksAndRole = async () => {
//   //     try {
//   //       const userData = localStorage.getItem("user");
//   //       const user = JSON.parse(userData);
//   //       // אפשר להוסיף כאן שליפת תפקיד/שכר לפי הצורך
//   //     } catch (error) {
//   //       console.error("Error loading data", error);
//   //     }
//   //   };
//   //   if (open) {
//   //     fetchBooksAndRole();
//   //   }
//   // }, [open]);
//   useEffect(() => {
//     const fetchRole = async () => {
//       try {
//         const userData = localStorage.getItem("user");
//         const user = JSON.parse(userData);
//         const roleId = user.role_id;
//         if (!roleId) return;
//         const roleData = await apiRequests.getRequest(`/roles/${roleId}`);
//         setRole(roleData); // שומר את כל אובייקט ה-role
//       } catch (err) {
//         console.error("Failed to load role", err);
//       }
//     };
//     fetchRole();
//   }, []);
  
  

//   const getSpecialWorkLabel = () => {
//     switch (roleName) {
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

//     // בדיקת חובה: ספר, שעות/דקות, תיאור, תאריך, שעות עבודה
//     if (!newWork.book_id) newErrors.book_id = "This field is required";
//     if (!newWork.hours && !newWork.minutes) newErrors.hours = "Enter hours or minutes";
//     if (
//       newWork.minutes &&
//       (isNaN(newWork.minutes) || newWork.minutes < 0 || newWork.minutes > 59)
//     ) newErrors.minutes = "Minutes must be between 0 and 59";
//     if (!newWork.description) newErrors.description = "This field is required";
//     if (!newWork.date) newErrors.date = "This field is required";
//     // בדיקת שעת התחלה וסיום (לא חובה, אבל אפשר להוסיף)
//     if (newWork.start_time && newWork.end_time && newWork.end_time < newWork.start_time)
//       newErrors.end_time = "End time must be after start time";

//     setErrors(newErrors);

//     if (Object.keys(newErrors).length === 0) {
//       setLoading(true);
//       try {
//         // חישוב כמות שעות עשרונית
//         const totalMinutes =
//           parseInt(newWork.hours || 0) * 60 + parseInt(newWork.minutes || 0);
//         const quantity = (totalMinutes / 60).toFixed(3); // שמור בדיוק עד דקה

//         await onAdd({
//           ...newWork,
//           quantity, // תמיד עשרוני
//           // שעות ודקות, למעקב פנימי (אפשר לא להעביר לשרת)
//           hours: undefined,
//           minutes: undefined
//         });
//         onClose();
//       } catch (error) {
//         alert("There was an error adding the work. Please try again.");
//       } finally {
//         setLoading(false);
//       }
//     }
//   };

//   function getLabelByRole(role) {
//     switch (role) {
//       case 'typist': return 'מספר תווים';
//       case 'designer': return 'מספר פריטים (שערים/טבלאות)';
//       case 'typesetter': return 'מספר עמודים';
//       case 'nikud': return 'מספר מילים';
//       default: return 'כמות';
//     }
//   }

//   return (
//     <Dialog open={open} onClose={onClose}>
//       <DialogTitle>Add New Work</DialogTitle>
//       <DialogContent>
//         <FormControl fullWidth margin="normal" error={!!errors.book_id}>
//           <InputLabel>Choose Book</InputLabel>
//           <Select name="book_id" value={newWork.book_id} onChange={handleInputChange}>
//             {books.map((book) => (
//               <MenuItem key={book.id_book} value={book.id_book}>
//                 {book.title}
//               </MenuItem>
//             ))}
//           </Select>
//           {errors.book_id && <FormHelperText>{errors.book_id}</FormHelperText>}
//         </FormControl>

//         {/* Work Amount group */}
//         {/* <Box sx={{ mt: 2, mb: 2, border: "1px solid #eee", borderRadius: 2, p: 2, background: "#f8f8fc" }}>
//           <Typography variant="subtitle2" sx={{ mb: 1, color: "#6c3483" }}>
//             Work Amount
//           </Typography>
//           <Box sx={{ display: "flex", gap: 2 }}>
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
//         </Box> */}

//         {/* Work time range group */}
//         {role && role.is_hourly_primary && (
//   <Box sx={{ display: "flex", gap: 2 }}>
//     <TextField
//       label="שעות"
//       name="hours"
//       type="number"
//       value={newWork.hours}
//       onChange={handleInputChange}
//       inputProps={{ min: 0 }}
//       fullWidth
//     />
//     <TextField
//       label="דקות"
//       name="minutes"
//       type="number"
//       value={newWork.minutes}
//       onChange={handleInputChange}
//       inputProps={{ min: 0, max: 59 }}
//       fullWidth
//     />
//   </Box>
// )}

// {role && !role.is_hourly_primary && (
//   <>
//     {role.uses_special_quantity && (
//       <FormControlLabel
//         control={
//           <Checkbox
//             checked={isSpecialWork}
//             onChange={(e) => setIsSpecialWork(e.target.checked)}
//           />
//         }
//         label="עבודה מיוחדת"
//       />
//     )}

//     {(isSpecialWork || !role.uses_special_quantity) && (
//       <TextField
//         label={getLabelByRole(role.role_name)}
//         type="number"
//         value={quantity}
//         onChange={(e) => setQuantity(e.target.value)}
//         fullWidth
//         margin="normal"
//       />
//     )}
//   </>
// )}

//         {/* <Box sx={{ mt: 1, mb: 2, border: "1px solid #eee", borderRadius: 2, p: 2, background: "#fafdff" }}>
//           <Typography variant="subtitle2" sx={{ mb: 1, color: "#2874a6" }}>
//             Work Time Range
//           </Typography>
//           <Box sx={{ display: "flex", gap: 2 }}>
//             <TextField
//               label="Start Time"
//               name="start_time"
//               type="time"
//               value={newWork.start_time || ""}
//               onChange={handleInputChange}
//               InputLabelProps={{ shrink: true }}
//               inputProps={{ step: 300 }}
//               fullWidth
//               error={!!errors.start_time}
//             />
//             <TextField
//               label="End Time"
//               name="end_time"
//               type="time"
//               value={newWork.end_time || ""}
//               onChange={handleInputChange}
//               InputLabelProps={{ shrink: true }}
//               inputProps={{ step: 300 }}
//               fullWidth
//               error={!!errors.end_time}
//               helperText={errors.end_time}
//             />
//           </Box>
//         </Box>
//  */}
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
//           {loading ? <CircularProgress size={24} color="secondary" /> : "Save"}
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
    specialWork: false
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSpecialWork, setIsSpecialWork] = useState(false);
  const [quantity, setQuantity] = useState("");

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
        specialWork: false
      });
      setErrors({});
      setIsSpecialWork(false);
      setQuantity("");
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

    if (role.role_name === 'editor') {
      if (!newWork.start_time || !newWork.end_time) {
        newErrors.start_time = "Start and end time are required for editors";
      }
    }

    if (role.role_name === 'typist') {
      if (!isSpecialWork && !quantity) newErrors.quantity = "Enter number of characters";
      if (isSpecialWork && (!newWork.start_time || !newWork.end_time)) {
        newErrors.start_time = "Start and end time are required for special work";
      }
    }

    if (role.role_name === 'designer') {
      if (!quantity) newErrors.quantity = "Enter type of graphic work";
      if (isSpecialWork && (!newWork.start_time || !newWork.end_time)) {
        newErrors.start_time = "Start and end time are required for special work";
      }
    }

    if (newWork.start_time && newWork.end_time && newWork.end_time < newWork.start_time) {
      newErrors.end_time = "End time must be after start time";
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
          quantity: role.role_name === 'editor' || (isSpecialWork && (role.role_name === 'typist' || role.role_name === 'designer')) ? hourQuantity : quantity,
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

  const getLabelByRole = (role) => {
    switch (role) {
      case 'typist': return 'מספר תווים';
      case 'designer': return 'סוג העבודה הגרפית';
      default: return 'כמות';
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
              <MenuItem key={book.id_book} value={book.id_book}>{book.title}</MenuItem>
            ))}
          </Select>
          {errors.book_id && <FormHelperText>{errors.book_id}</FormHelperText>}
        </FormControl>

        {/* EDITOR: זמן התחלה וסיום */}
        {role.role_name === 'editor' && (
          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField label="Start Time" name="start_time" type="time" value={newWork.start_time} onChange={handleInputChange} fullWidth error={!!errors.start_time} />
            <TextField label="End Time" name="end_time" type="time" value={newWork.end_time} onChange={handleInputChange} fullWidth error={!!errors.end_time} helperText={errors.end_time} />
          </Box>
        )}

        {/* TYPIST & DESIGNER: עבודה מיוחדת או כמות */}
        {(role.role_name === 'typist' || role.role_name === 'designer') && (
          <>
            <FormControlLabel
              control={<Checkbox checked={isSpecialWork} onChange={handleCheckboxChange} />}
              label="עבודה מיוחדת"
            />

            {!isSpecialWork && (
              <TextField
                label={getLabelByRole(role.role_name)}
                type="text"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                fullWidth
                margin="normal"
                error={!!errors.quantity}
                helperText={errors.quantity}
              />
            )}

            {isSpecialWork && (
              <Box sx={{ display: "flex", gap: 2 }}>
                <TextField label="Start Time" name="start_time" type="time" value={newWork.start_time} onChange={handleInputChange} fullWidth error={!!errors.start_time} />
                <TextField label="End Time" name="end_time" type="time" value={newWork.end_time} onChange={handleInputChange} fullWidth error={!!errors.end_time} helperText={errors.end_time} />
              </Box>
            )}
          </>
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