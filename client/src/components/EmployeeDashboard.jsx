import React, { useState, useEffect } from "react";
import { Box, Typography, Container, Button, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { APIrequests } from "../APIrequests"; 
import WorkLogs from "./WorkLogs";
import WorkForm from "./WorkForm";
import ErrorNotification from "./ErrorNotification";
import AddWorkDialog from "./AddWorkDialog"; // השתמש בקומפוננטה החדשה כאן

const EmployeeDashboard = () => {
  const [workLogs, setWorkLogs] = useState([]);
  const [newWork, setNewWork] = useState({ bookId: "", hoursWorked: "", comments: "" });
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false); // מצב להצגת הדיאלוג

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

  // טיפול בשליחת עבודה חדשה
  const handleAddWork = async () => {
    try {
      const { book_id, quantity, description, notes } = newWork; // הגדרת הערכים מתוך הסטייט
      if (!book_id || !quantity || !description) { // בדיקת שדות חובה
        setError("Please fill in all fields");
        return;
      }
  
      // קריאה ל-API לשליחת הנתונים
      await apiRequests.postRequest("/worklogs", { book_id, quantity, description, notes });
  
      // איפוס הסטייט לאחר הוספת העבודה
      setNewWork({ book_id: "", quantity: "", description: "", notes: "" });
      setOpen(false); // סגירת הדיאלוג
      fetchWorkLogs(); // עדכון הרשימה עם העבודה החדשה
    } catch (err) {
      setError("Failed to add work log"); // הצגת שגיאה במקרה של בעיה בהוספה
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
      <Typography variant="h4" gutterBottom>
        Employee Dashboard
      </Typography>

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
    </Container>
  );
};

export default EmployeeDashboard;