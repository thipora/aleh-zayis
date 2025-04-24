// import React, { useState, useEffect } from "react";
// import { Box, Typography, Container, Button, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
// import { APIrequests } from "../APIrequests";
// import WorkEntries from "./WorkEntries";
// import ErrorNotification from "./ErrorNotification";
// import AddWorkDialog from "./AddWorkDialog"; // השתמש בקומפוננטה החדשה כאן
// // import ChangePasswordDialog from "./ChangePasswordDialog";


// const EmployeeDashboard = () => {
//   const [workEntries, setWorkEntries] = useState([]);
//   const [newWorkEntrie, setNewWork] = useState({
//     book_id: "",
//     quantity: "",
//     description: "",
//     notes: "",
//     date: new Date().toISOString().split('T')[0] // תאריך ברירת מחדל
//   });
//   const [error, setError] = useState("");
//   const [open, setOpen] = useState(false); // מצב להצגת הדיאלוג
//   const [isPasswordDialogOpen, setPasswordDialogOpen] = useState(false);
//   const [loadingBooks, setLoadingBooks] = useState(false);


//   const apiRequests = new APIrequests();

//   // טוען את נתוני העבודה של העובד
//   const fetchWorkEntries = async () => {
//     try {
//       const userData = localStorage.getItem("user");
//       const user = JSON.parse(userData);
//       const data = await apiRequests.getRequest(`/workEntries/${user.employee_id}`);
//       setWorkEntries(data);
//     } catch (err) {
//       console.log(err);
//       setError("Failed to fetch work logs");
//     }
//   };



//   const handleAddWork = async (newWorkData) => {
//     try {
//       const { book_id, book_name, quantity, description, notes, specialWork, date } = newWorkData; // קבלת הנתונים החדשים
//       const userData = localStorage.getItem("user");
//       const user = JSON.parse(userData);
//       const employeeId = user?.employee_id;
//       const currentDate = new Date().toISOString().split('T')[0];

//       // קריאה ל-API לשליחת הנתונים כולל specialWork
//       await apiRequests.postRequest(`/workEntries/${employeeId}`, {
//         book_id,
//         book_name,
//         quantity,
//         description,
//         notes,
//         date,
//         specialWork // הוספת specialWork לנתונים
//       });

//       setWorkEntries((prevWorkEntries) => [...prevWorkEntries, { ...newWorkData, specialWork }]); // עדכון הסטייט עם העבודה החדשה

//       // עדכון הסטייט עם הערכים החדשים
//       setNewWork({ book_id: "", quantity: "", description: "", notes: "", specialWork: false, date: currentDate });
//       setOpen(false); // סגירת הדיאלוג
//       fetchWorkEntries(); // עדכון הרשימה עם העבודה החדשה
//     } catch (err) {
//       setError("Failed to add work log");
//     }
//   };




//   const handleUpdateWork = async (updatedWork) => {
//     try {
//       // שליחת העבודה המעודכנת לשרת (יש לשלוח את הנתונים לרקורסיה המתאימה בשרת שלך)
//       await apiRequests.putRequest(`/workEntries/${updatedWork.id_work_entries}`, updatedWork);
//       fetchWorkEntries(); // עדכון הרשימה עם העבודה המעודכנת
//     } catch (err) {
//       setError("Failed to update work log");
//     }
//   };

//   useEffect(() => {
//     fetchWorkEntries(); // טוען את העבודה בהתחלה
//   }, []);

//   return (
//     <Container>
//         <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
//           <Typography variant="h4">Employee Dashboard</Typography>
//         </Box>

//       {/* הצגת שגיאה אם יש */}
//       <ErrorNotification error={error} />

//       {/* רשימת העבודה של העובד */}
//       <WorkEntries workEntries={workEntries} onUpdate={handleUpdateWork} /> 

//       {/* כפתור לפתיחת הדיאלוג */}
//       <Box mt={2}>
//         <Button variant="contained" color="primary" onClick={() => setOpen(true)}>
//           Add New
//         </Button>
//       </Box>

//       {/* דיאלוג (חלון קופץ) להוספת עבודה */}
//       <Dialog open={open} onClose={() => setOpen(false)}>
//         <DialogTitle>Add New</DialogTitle>
//         <DialogContent>
//           <AddWorkDialog open={open} onClose={() => setOpen(false)} onAdd={handleAddWork} />
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setOpen(false)} color="secondary">ביטול</Button>
//         </DialogActions>
//       </Dialog>

// {/* <ChangePasswordDialog
//   open={isPasswordDialogOpen}
//   onClose={() => setPasswordDialogOpen(false)}
//   userId={JSON.parse(localStorage.getItem("user")).id_user}
// /> */}

//     </Container>

    
//   );

// };

// export default EmployeeDashboard;


import React, { useState, useEffect } from "react";
import { Box, Typography, Container, Button, Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress } from "@mui/material";
import { APIrequests } from "../APIrequests";
import WorkEntries from "./WorkEntries";
import ErrorNotification from "./ErrorNotification";
import AddWorkDialog from "./AddWorkDialog"; 
// import ChangePasswordDialog from "./ChangePasswordDialog";

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

  const apiRequests = new APIrequests();

  // טוען את נתוני העבודה של העובד
  const fetchWorkEntries = async () => {
    try {
      const userData = localStorage.getItem("user");
      const user = JSON.parse(userData);
      const data = await apiRequests.getRequest(`/workEntries/${user.employee_id}`);
      setWorkEntries(data);
    } catch (err) {
      console.log(err);
      setError("Failed to fetch work logs");
    }
  };

  // טעינת ספרים לפני פתיחת הדיאלוג
  const handleOpenAddWork = async () => {
    setLoadingBooks(true);
    setOpen(true);
    try {
      const userData = localStorage.getItem("user");
      const user = JSON.parse(userData);
      const booksData = await apiRequests.getRequest(`/books/${user.employee_id}`);
      setBooks(booksData);
    } catch (err) {
      setBooks([]);
      setError("Failed to load books.");
    }
    setLoadingBooks(false);
  };

  const handleAddWork = async (newWorkData) => {
    try {
      const { book_id, book_name, quantity, description, notes, specialWork, date } = newWorkData;
      const userData = localStorage.getItem("user");
      const user = JSON.parse(userData);
      const employeeId = user?.employee_id;
      const currentDate = new Date().toISOString().split('T')[0];

      await apiRequests.postRequest(`/workEntries/${employeeId}`, {
        book_id,
        book_name,
        quantity,
        description,
        notes,
        date,
        specialWork
      });

      setWorkEntries((prevWorkEntries) => [...prevWorkEntries, { ...newWorkData, specialWork }]);
      setNewWork({ book_id: "", quantity: "", description: "", notes: "", specialWork: false, date: currentDate });
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

  useEffect(() => {
    fetchWorkEntries();
  }, []);

  return (
    <Container>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4">Employee Dashboard</Typography>
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
            <AddWorkDialog
              open={open}
              onClose={() => setOpen(false)}
              onAdd={handleAddWork}
              books={books} // books עוברים כ-prop
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="secondary">ביטול</Button>
        </DialogActions>
      </Dialog>

      {/* <ChangePasswordDialog
        open={isPasswordDialogOpen}
        onClose={() => setPasswordDialogOpen(false)}
        userId={JSON.parse(localStorage.getItem("user")).id_user}
      /> */}

    </Container>
  );
};

export default EmployeeDashboard;
