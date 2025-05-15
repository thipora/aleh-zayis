// import React from "react";
// import { Box, Typography, Container, Button } from "@mui/material";
// import { useNavigate } from "react-router-dom"; // שימוש ב-useNavigate לצורך ניווט

// const ManagerPage = () => {
//   const navigate = useNavigate(); // יצירת פונקציית ניווט

//   // ניווט לדף העובדים
//   const goToEmployeeList = () => {
//     navigate("/employee-list"); // ניווט לדף של רשימת העובדים
//   };

//   return (
//     <Container>
//       <Box sx={{ padding: 3 }}>
//         <Typography variant="h4" gutterBottom>
//           Manager Dashboard
//         </Typography>
//         <Button
//           variant="contained"
//           color="primary"
//           onClick={goToEmployeeList} // קריאה לפונקציה שמביאה לדף העובדים
//         >
//           לעובדים
//         </Button>
//       </Box>
//     </Container>
//   );
// };

// export default ManagerPage;

import React from "react";
import { useNavigate } from "react-router-dom";

const ManagerDashboard = () => {
  const navigate = useNavigate();

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Manager Dashboard</h2>

      <div style={{ marginTop: "1rem" }}>
        <button onClick={() => navigate("/manager/employees")}>
          View Employee List
        </button>
        <button onClick={() => navigate("/manager/reports")} style={{ marginLeft: "1rem" }}>
          Go to Reports
        </button>
      </div>
    </div>
  );
};

export default ManagerDashboard;
