import React, { useState, useEffect } from "react";
import { Box, Typography, Container } from "@mui/material";
import { APIrequests } from "../APIrequests"; 
import WorkLogs from "./WorkLogs";
import WorkForm from "./WorkForm";
import ErrorNotification from "./ErrorNotification";

const EmployeeDashboard = () => {
  const [workLogs, setWorkLogs] = useState([]);
  const [newWork, setNewWork] = useState({ bookId: "", hoursWorked: "", comments: "" });
  const [error, setError] = useState("");
  
  const apiRequests = new APIrequests();

  // טוען את נתוני העבודה של העובד
  const fetchWorkLogs = async () => {
    try {
      const data = await apiRequests.getRequest("/worklogs");
      setWorkLogs(data);
    } catch (err) {
      setError("Failed to fetch work logs");
    }
  };

  // טיפול בשליחת עבודה חדשה
  const handleAddWork = async () => {
    try {
      const { bookId, hoursWorked, comments } = newWork;
      if (!bookId || !hoursWorked) {
        setError("Please fill in all fields");
        return;
      }

      await apiRequests.postRequest("/worklogs", { bookId, hoursWorked, comments });
      setNewWork({ bookId: "", hoursWorked: "", comments: "" });
      fetchWorkLogs(); // עדכון העבודה שהוזנה
    } catch (err) {
      setError("Failed to add work log");
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
      <WorkLogs workLogs={workLogs} />

      {/* טופס להוספת עבודה חדשה */}
      <WorkForm newWork={newWork} setNewWork={setNewWork} handleAddWork={handleAddWork} />
    </Container>
  );
};

export default EmployeeDashboard;
