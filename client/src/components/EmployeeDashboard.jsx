import React, { useState, useEffect } from "react";
import { Box, Typography, Container, Button, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { APIrequests } from "../APIrequests";
import WorkLogs from "./WorkLogs";
import ErrorNotification from "./ErrorNotification";
import AddWorkDialog from "./AddWorkDialog"; // השתמש בקומפוננטה החדשה כאן
import ChangePasswordDialog from "./ChangePasswordDialog";


const EmployeeDashboard = () => {
  const [workLogs, setWorkLogs] = useState([]);
  const [newWorkLog, setNewWork] = useState({
    book_id: "",
    quantity: "",
    description: "",
    notes: "",
    date: new Date().toISOString().split('T')[0] // תאריך ברירת מחדל
  });
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false); // מצב להצגת הדיאלוג
  const [isPasswordDialogOpen, setPasswordDialogOpen] = useState(false);


  const apiRequests = new APIrequests();

  // טוען את נתוני העבודה של העובד
  const fetchWorkLogs = async () => {
    try {
      const userData = localStorage.getItem("user");
      const user = JSON.parse(userData);
      const data = await apiRequests.getRequest(`/worklogs/${user.id_user}`);
      setWorkLogs(data);
    } catch (err) {
      console.log(err);
      setError("Failed to fetch work logs");
    }
  };



  const handleAddWork = async (newWorkData) => {
    try {
      const { book_id, quantity, description, notes, specialWork } = newWorkData; // קבלת הנתונים החדשים
      const userData = localStorage.getItem("user");
      const user = JSON.parse(userData);
      const userId = user?.id_user;
      const currentDate = new Date().toISOString().split('T')[0];

      // קריאה ל-API לשליחת הנתונים כולל specialWork
      await apiRequests.postRequest(`/worklogs/${userId}`, {
        book_id,
        quantity,
        description,
        notes,
        user_id: userId,
        date: currentDate,
        specialWork // הוספת specialWork לנתונים
      });

      setWorkLogs((prevWorkLogs) => [...prevWorkLogs, { ...newWorkData, specialWork }]); // עדכון הסטייט עם העבודה החדשה

      // עדכון הסטייט עם הערכים החדשים
      setNewWork({ book_id: "", quantity: "", description: "", notes: "", specialWork: false, date: currentDate });
      setOpen(false); // סגירת הדיאלוג
      fetchWorkLogs(); // עדכון הרשימה עם העבודה החדשה
    } catch (err) {
      setError("Failed to add work log");
    }
  };




  const handleUpdateWork = async (updatedWork) => {
    try {
      // שליחת העבודה המעודכנת לשרת (יש לשלוח את הנתונים לרקורסיה המתאימה בשרת שלך)
      await apiRequests.putRequest(`/worklogs/${updatedWork.id_work_logs}`, updatedWork);
      fetchWorkLogs(); // עדכון הרשימה עם העבודה המעודכנת
    } catch (err) {
      setError("Failed to update work log");
    }
  };

  useEffect(() => {
    fetchWorkLogs(); // טוען את העבודה בהתחלה
  }, []);

  return (
    <Container>
      {/* <Typography variant="h4" gutterBottom> */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h4">Employee Dashboard</Typography>
          {/* <Button variant="outlined" onClick={() => setPasswordDialogOpen(true)}>
            שינוי סיסמה
          </Button> */}
        </Box>
{/* 
        Employee Dashboard
      </Typography> */}

      {/* הצגת שגיאה אם יש */}
      <ErrorNotification error={error} />

      {/* רשימת העבודה של העובד */}
      <WorkLogs workLogs={workLogs} onUpdate={handleUpdateWork} /> {/* שולח את handleUpdateWork כ-prop */}

      {/* כפתור לפתיחת הדיאלוג */}
      <Box mt={2}>
        <Button variant="contained" color="primary" onClick={() => setOpen(true)}>
          הוסף עבודה חדשה
        </Button>
      </Box>

      {/* דיאלוג (חלון קופץ) להוספת עבודה */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>הוספת עבודה חדשה</DialogTitle>
        <DialogContent>
          {/* <WorkForm newWork={newWork} setNewWork={setNewWork} handleAddWork={handleAddWork} /> */}
          <AddWorkDialog open={open} onClose={() => setOpen(false)} onAdd={handleAddWork} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="secondary">ביטול</Button>
        </DialogActions>
      </Dialog>

      {/* דיאלוג לשינוי סיסמה */}
<ChangePasswordDialog
  open={isPasswordDialogOpen}
  onClose={() => setPasswordDialogOpen(false)}
  userId={JSON.parse(localStorage.getItem("user")).id_user}
/>

    </Container>

    
  );

};

export default EmployeeDashboard;