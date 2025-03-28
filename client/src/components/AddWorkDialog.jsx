// import React, { useState, useEffect } from "react";
// import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, CircularProgress, MenuItem, Select, FormControl, InputLabel } from "@mui/material";
// import { APIrequests } from "../APIrequests";

// const AddWorkDialog = ({ open, onClose, onAdd }) => {
//   const [newWork, setNewWork] = useState({
//     book_id: "",  // ID של הספר הנבחר
//     quantity: "",  // כמות העבודה שבוצעה
//     description: "", // פירוט מה נעשה
//     notes: "", // הערות נוספות
//   });
//   const [books, setBooks] = useState([]); // רשימת הספרים מה-DB
//   const [loading, setLoading] = useState(false);
//   const apiRequests = new APIrequests();

//   useEffect(() => {
//     // קריאה לשרת כדי להביא את רשימת הספרים מה-DB
//     const fetchBooks = async () => {
//       try {
//         const userData = localStorage.getItem("user");
//         const user = JSON.parse(userData);

//         const data = await apiRequests.getRequest(`/books/${user.id_user}`);

//         setBooks(data); // שמירת הספרים בסטייט
//       } catch (error) {
//         console.error("שגיאה בטעינת רשימת הספרים", error);
//       }
//     };

//     if (open) {
//       fetchBooks(); // נטען את הספרים רק כשהדיאלוג נפתח
//     }
//   }, [open]);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setNewWork(prevState => ({
//       ...prevState,
//       [name]: value
//     }));
//   };

//   const handleSave = async () => {
//     if (newWork.book_id && newWork.quantity && newWork.description) {
//       setLoading(true);
//       try {
//         await onAdd(newWork); // שולח את העבודה החדשה
//         onClose(); // סגירת הדיאלוג לאחר ההוספה
//       } catch (error) {
//         alert("הייתה שגיאה בהוספת העבודה. אנא נסה שוב.");
//       } finally {
//         setLoading(false);
//       }
//     } else {
//       alert("אנא מלא את כל השדות.");
//     }
//   };

//   return (
//     <Dialog open={open} onClose={onClose}>
//       <DialogTitle>הוסף עבודה חדשה</DialogTitle>
//       <DialogContent>
//         {/* בחירת ספר מתוך רשימה */}

//         <FormControl fullWidth margin="normal">
//           <InputLabel>בחר ספר</InputLabel>
//           <Select
//             name="book_id"
//             value={newWork.book_id}
//             onChange={handleInputChange}
//           >

//             {books.map((book) => (
//               <MenuItem key={book.id_book} value={book.id_book}>
//                 {book.title}
//               </MenuItem>
//             ))}
//           </Select>
//         </FormControl>

//         <TextField
//           label="כמות שהספקת"
//           name="quantity"
//           value={newWork.quantity || ""}
//           onChange={handleInputChange}
//           fullWidth
//           margin="normal"
//           type="number"
//         />
//         <TextField
//           label="הסבר על העבודה"
//           name="description"
//           value={newWork.description || ""}
//           onChange={handleInputChange}
//           fullWidth
//           margin="normal"
//         />
//         <TextField
//           label="הערות"
//           name="notes"
//           value={newWork.notes || ""}
//           onChange={handleInputChange}
//           fullWidth
//           margin="normal"
//         />
//       </DialogContent>
//       <DialogActions>
//         <Button onClick={onClose} color="secondary">ביטול</Button>
//         <Button onClick={handleSave} color="primary" disabled={loading}>
//           {loading ? <CircularProgress size={24} color="secondary" /> : 'שמור'}
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// };

// export default AddWorkDialog;
import React, { useState, useEffect } from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, CircularProgress, MenuItem, Select, FormControl, InputLabel } from "@mui/material";
import { APIrequests } from "../APIrequests";

const AddWorkDialog = ({ open, onClose, onAdd }) => {
  const [newWork, setNewWork] = useState({
    book_id: "",  // ID של הספר הנבחר
    quantity: "",  // כמות העבודה שבוצעה
    description: "", // פירוט מה נעשה
    notes: "", // הערות נוספות
    date: new Date().toISOString().split('T')[0] // תאריך ברירת מחדל של היום
  });
  const [books, setBooks] = useState([]); // רשימת הספרים מה-DB
  const [loading, setLoading] = useState(false);
  const apiRequests = new APIrequests();

  useEffect(() => {
    // קריאה לשרת כדי להביא את רשימת הספרים מה-DB
    const fetchBooks = async () => {
      try {
        const userData = localStorage.getItem("user");
        const user = JSON.parse(userData);

        const data = await apiRequests.getRequest(`/books/${user.id_user}`);

        setBooks(data); // שמירת הספרים בסטייט
      } catch (error) {
        console.error("שגיאה בטעינת רשימת הספרים", error);
      }
    };

    if (open) {
      fetchBooks(); // נטען את הספרים רק כשהדיאלוג נפתח
    }
  }, [open]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewWork(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSave = async () => {
    if (newWork.book_id && newWork.quantity && newWork.description) {
      setLoading(true);
      try {
        await onAdd(newWork); // שולח את העבודה החדשה
        onClose(); // סגירת הדיאלוג לאחר ההוספה
      } catch (error) {
        alert("הייתה שגיאה בהוספת העבודה. אנא נסה שוב.");
      } finally {
        setLoading(false);
      }
    } else {
      alert("אנא מלא את כל השדות.");
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>הוסף עבודה חדשה</DialogTitle>
      <DialogContent>
        {/* בחירת ספר מתוך רשימה */}
        <FormControl fullWidth margin="normal">
          <InputLabel>בחר ספר</InputLabel>
          <Select
            name="book_id"
            value={newWork.book_id}
            onChange={handleInputChange}
          >
            {books.map((book) => (
              <MenuItem key={book.id_book} value={book.id_book}>
                {book.title}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          label="כמות שהספקת"
          name="quantity"
          value={newWork.quantity || ""}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
          type="number"
        />
        <TextField
          label="הסבר על העבודה"
          name="description"
          value={newWork.description || ""}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="הערות"
          name="notes"
          value={newWork.notes || ""}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />

        {/* שדה תאריך */}
        <TextField
          label="תאריך"
          name="date"
          type="date"
          value={newWork.date}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
          InputLabelProps={{
            shrink: true,
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">ביטול</Button>
        <Button onClick={handleSave} color="primary" disabled={loading}>
          {loading ? <CircularProgress size={24} color="secondary" /> : 'שמור'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddWorkDialog;
