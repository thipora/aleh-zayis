import React from "react";
import { Box, Typography, Container, Button } from "@mui/material";
import { useNavigate } from "react-router-dom"; // שימוש ב-useNavigate לצורך ניווט

const ManagerPage = () => {
  const navigate = useNavigate(); // יצירת פונקציית ניווט

  // ניווט לדף העובדים
  const goToEmployeeList = () => {
    navigate("/employee-list"); // ניווט לדף של רשימת העובדים
  };

  return (
    <Container>
      <Box sx={{ padding: 3 }}>
        <Typography variant="h4" gutterBottom>
          Manager Dashboard
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={goToEmployeeList} // קריאה לפונקציה שמביאה לדף העובדים
        >
          לעובדים
        </Button>
      </Box>
    </Container>
  );
};

export default ManagerPage;
