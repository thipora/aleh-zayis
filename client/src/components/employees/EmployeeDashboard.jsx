import React, { useState, useEffect } from "react";
import { Select, InputLabel, FormControl,FormControlLabel, Checkbox, TextField, Box, Typography, Container, Button, Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress } from "@mui/material";
import { APIrequests } from "../../APIrequests";
import WorkEntries from "../workEntries/WorkEntries.jsx";
import ErrorNotification from "../common/ErrorNotification";
import AddWorkDialog from "../workEntries/AddWorkDialog"; 
// import ChangePasswordDialog from "./ChangePasswordzzzzDialog";
import SummaryDialog from "../reports/SummaryDialog"; // תוסיפי למעלה


const EmployeeDashboard = () => {
  const [workEntries, setWorkEntries] = useState([]);
  const [newWorkEntrie, setNewWork] = useState({
    book_id: "",
    quantity: "",
    description: "",
    notes: "",
    date: new Date().toISOString().split('T')[0]
  });
  const [books, setBooks] = useState([]);
  const [loadingBooks, setLoadingBooks] = useState(false);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const [isPasswordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [openMonthSummary, setOpenMonthSummary] = useState(false);
  // const [openBookSummary, setOpenBookSummary] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedBook, setSelectedBook] = useState("");
  const [monthSummary, setMonthSummary] = useState([]);
  const [bookSummary, setBookSummary] = useState([]);
  const [months, setMonths] = useState([]);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [role, setRole] = useState(null);
  const [openAddBook, setOpenAddBook] = useState(false);
  const [bookId, setBookId] = useState('');
  const [availableRoles, setAvailableRoles] = useState([]);
const [selectedRoles, setSelectedRoles] = useState([]);



  const apiRequests = new APIrequests();

  const handleOpenAddWork = async () => {
    setLoadingBooks(true);
    try {
      const userData = localStorage.getItem("user");
      const user = JSON.parse(userData);
      
      const booksData = await apiRequests.getRequest(`/books/${user.employee_id}`);
      setBooks(booksData);
  
      const ids = user.roles.join(','); // יוצר מחרוזת "1,2,3"
      const roleData = await apiRequests.getRequest(`/roles?ids=${ids}`);

      setRole(roleData);
  
      setOpen(true);
  
    } catch (err) {
      setBooks([]);
      setError("Failed to load data.");
    }
    setLoadingBooks(false);
  };
  

  const handleAddWork = async (newWorkData) => {
    try {
      const { book_id, book_name, quantity, description, notes, is_special_work, date, start_time, end_time } = newWorkData;
      const userData = localStorage.getItem("user");
      const user = JSON.parse(userData);
      const employeeId = user?.employee_id;
      const roleId = user?.roles[0];
      const currentDate = new Date().toISOString().split('T')[0];

      await apiRequests.postRequest(`/workEntries/${employeeId}`, {
        roleId,
        book_id,
        book_name,
        quantity,
        description,
        notes,
        date,
        is_special_work,
        start_time,
        end_time
      });

      setWorkEntries((prevWorkEntries) => [...prevWorkEntries, { ...newWorkData, is_special_work }]);
      setNewWork({ book_id: "", quantity: "", description: "", notes: "", is_special_work: false, date: currentDate });
      setOpen(false);
      fetchWorkEntries();
    } catch (err) {
      setError("Failed to add work log");
    }
  };

  const handleUpdateWork = async (updatedWork) => {
    try {
      await apiRequests.putRequest(`/workEntries/${updatedWork.id_work_entries}`, updatedWork);
      fetchWorkEntries();
    } catch (err) {
      setError("Failed to update work log");
    }
  };

  const extractMonths = (entries) => {
    const uniqueMonths = [...new Set(entries.map(e => e.date.substring(0,7)))];
    return uniqueMonths.sort().reverse();
  };
  
  const fetchWorkEntries = async () => {
    try {
      const userData = localStorage.getItem("user");
      const user = JSON.parse(userData);
      const data = await apiRequests.getRequest(`/workEntries/${user.employee_id}`);
      setWorkEntries(data);
      setMonths(extractMonths(data)); // מוסיף את רשימת החודשים
      // שליפת ספרים רק אם books לא מאותחל (יעיל)
      if (!books.length) {
        const booksData = await apiRequests.getRequest(`/books/${user.employee_id}`);
        setBooks(booksData);
      }
    } catch (err) {
      setError("Failed to fetch work logs");
    }
  };

  const handleOpenMonthSummary = () => setOpenMonthSummary(true);
const handleCloseMonthSummary = () => setOpenMonthSummary(false);
// const handleOpenBookSummary = () => setOpenBookSummary(true);
// const handleCloseBookSummary = () => setOpenBookSummary(false);

const handleFetchMonthSummary = async () => {
  if (!selectedMonth) return;
  setLoadingSummary(true);
  try {
    const userData = localStorage.getItem("user");
    const user = JSON.parse(userData);
    const url = `/summary/byMonth/${user.employee_id}?month=${selectedMonth}`;
    const summary = await apiRequests.getRequest(url);
    setMonthSummary(summary);
  } catch {
    setError("Failed to load summary");
  }
  setLoadingSummary(false);
};

// const handleAddBook = async () => {

//   const userData = localStorage.getItem("user");
//   const user = JSON.parse(userData);
//   const employeeId = user?.employee_id;
//   const bookClickUpId = bookId;
//   try {
//     const url = `/book-assignments`;
//     const body = {
//       bookClickUpId,
//       employeeId,
//     };
//     await apiRequests.postRequest(url, body);
//     onSuccess?.();
//     onClose();
//   } catch (err) {
//     alert("Failed to add book assignment");
//   }
// };

const handleAddBook = async () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const employeeId = user?.employee_id;
  const bookClickUpId = bookId;

  const selectedRoleIds = availableRoles.length === 1
    ? [availableRoles[0].id_role]
    : selectedRoles;

  if (!bookId) return alert("אנא הזן Book ID");
  if (selectedRoleIds.length === 0) return alert("בחר לפחות תפקיד אחד");

  try {
    await apiRequests.postRequest(`/book-assignments`, {
      bookClickUpId,
      employeeId,
      selectedRoleIds
    });

    setOpenAddBook(false);
    setSelectedRoles([]);
    setBookId("");
  } catch (err) {
    alert("שגיאה בהוספת הספר");
  }
};


const handleOpenAddBookDialog = async () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const roleIds = user.roles || [];

  setBookId("");
  setSelectedRoles([]);
  setAvailableRoles([]);

  if (roleIds.length > 1) {
    try {
      const response = await apiRequests.getRequest(`/roles?ids=${roleIds.join(',')}`);
      setAvailableRoles(response); // [{ id_role, role_name }]
    } catch (err) {
      console.error("Failed to fetch role names", err);
    }
  } else if (roleIds.length === 1) {
    setAvailableRoles([{ id_role: roleIds[0], role_name: "תפקיד יחיד" }]);
  }

  setOpenAddBook(true);
};



// const handleFetchBookSummary = async () => {
//   if (!selectedBook) return;
//   setLoadingSummary(true);
//   try {
//     const userData = localStorage.getItem("user");
//     const user = JSON.parse(userData);
//     const url = `/summary/byBook/${user.employee_id}?bookId=${selectedBook}`;
//     const summary = await apiRequests.getRequest(url);
//     setBookSummary(summary);
//   } catch {
//     setError("Failed to load summary");
//   }
//   setLoadingSummary(false);
// };

  

  useEffect(() => {
    fetchWorkEntries();
  }, []);

  return (
    <Container>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4">Employee Dashboard</Typography>
      </Box>

      <Box mt={2} display="flex" gap={2}>
      {/* <Button variant="contained" onClick={() => setOpenAddBook(true)}> */}
            <Button variant="contained" onClick={handleOpenAddBookDialog}>
  הוספת ספר שאני עובד עליו
</Button>

  <Button variant="outlined" color="secondary" onClick={handleOpenMonthSummary}>
    סיכום שעות לפי חודש
  </Button>
  {/* <Button variant="outlined" color="secondary" onClick={handleOpenBookSummary}>
    סיכום שעות לפי ספר
  </Button> */}
</Box>


      {/* הצגת שגיאה אם יש */}
      <ErrorNotification error={error} />

      {/* רשימת העבודה של העובד */}
      <WorkEntries workEntries={workEntries} onUpdate={handleUpdateWork} />

      {/* כפתור לפתיחת הדיאלוג */}
      <Box mt={2}>
        <Button variant="contained" color="primary" onClick={handleOpenAddWork}>
          Add New
        </Button>
      </Box>

      {/* דיאלוג (חלון קופץ) להוספת עבודה */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Add New</DialogTitle>
        <DialogContent>
          {loadingBooks ? (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight={150}>
              <CircularProgress color="primary" />
            </Box>
          ) : (
            // <AddWorkDialog
            //   open={open}
            //   onClose={() => setOpen(false)}
            //   onAdd={handleAddWork}
            //   books={books} // books עוברים כ-prop
            // />

            <AddWorkDialog
  open={open}
  onClose={() => setOpen(false)}
  onAdd={handleAddWork}
  books={books}
  role={role}
/>

          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="secondary">ביטול</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openAddBook} onClose={() => setOpenAddBook(false)}>
  <DialogTitle>הוספת ספר</DialogTitle>
  <DialogContent>
    <TextField
      label="Book ID"
      value={bookId}
      onChange={(e) => setBookId(e.target.value)}
      fullWidth
    />
    {availableRoles.length > 1 && (
  <>
    <Typography sx={{ mt: 2 }}>בחר תפקידים:</Typography>
    {availableRoles.map(role => (
      <FormControlLabel
        key={role.id_role}
        control={
          <Checkbox
            checked={selectedRoles.includes(role.id_role)}
            onChange={(e) => {
              if (e.target.checked) {
                setSelectedRoles(prev => [...prev, role.id_role]);
              } else {
                setSelectedRoles(prev => prev.filter(id => id !== role.id_role));
              }
            }}
          />
        }
        label={role.role_name}
      />
    ))}
  </>
)}

  </DialogContent>
  <DialogActions>
    <Button onClick={() => setOpenAddBook(false)}>ביטול</Button>
    <Button onClick={handleAddBook} variant="contained" color="primary">שמור</Button>
  </DialogActions>
</Dialog>


<SummaryDialog
      open={openMonthSummary}
      type="month"
      options={months}
      selected={selectedMonth}
      onSelect={setSelectedMonth}
      onFetch={handleFetchMonthSummary}
      summary={monthSummary}
      loading={loadingSummary}
      onClose={handleCloseMonthSummary}
      label="בחר חודש"
    />

    {/* <SummaryDialog
      open={openBookSummary}
      type="book"
      options={books}
      selected={selectedBook}
      onSelect={setSelectedBook}
      onFetch={handleFetchBookSummary}
      summary={bookSummary}
      loading={loadingSummary}
      onClose={handleCloseBookSummary}
      label="בחר ספר"
    /> */}

    </Container>
  );
};

export default EmployeeDashboard;



