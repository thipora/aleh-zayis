// // import React from "react";
// // import { Box, Typography, Container, Button } from "@mui/material";
// // import { useNavigate } from "react-router-dom"; // שימוש ב-useNavigate לצורך ניווט

// // const ManagerPage = () => {
// //   const navigate = useNavigate(); // יצירת פונקציית ניווט

// //   // ניווט לדף העובדים
// //   const goToEmployeeList = () => {
// //     navigate("/employee-list"); // ניווט לדף של רשימת העובדים
// //   };

// //   return (
// //     <Container>
// //       <Box sx={{ padding: 3 }}>
// //         <Typography variant="h4" gutterBottom>
// //           Manager Dashboard
// //         </Typography>
// //         <Button
// //           variant="contained"
// //           color="primary"
// //           onClick={goToEmployeeList} // קריאה לפונקציה שמביאה לדף העובדים
// //         >
// //           לעובדים
// //         </Button>
// //       </Box>
// //     </Container>
// //   );
// // };

// // export default ManagerPage;

// import React from "react";
// import { useNavigate } from "react-router-dom";

// const ManagerDashboard = () => {
//   const navigate = useNavigate();

//   return (
//     <div style={{ padding: "2rem" }}>
//       <h2>Manager Dashboard</h2>

//       <div style={{ marginTop: "1rem" }}>
//         <button onClick={() => navigate("/manager/employees")}>
//           View Employee List
//         </button>
//         <button onClick={() => navigate("/manager/reports")} style={{ marginLeft: "1rem" }}>
//           Go to Reports
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ManagerDashboard;
import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Typography } from "@mui/material";

const ManagerDashboard = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        bgcolor: "#fdf9f3",
        minHeight: "100vh",
        px: { xs: 2, sm: 4 },
        py: { xs: 4, sm: 6 },
      }}
    >
      <Typography
        variant="h4"
        gutterBottom
        sx={{ color: "#5d4037", fontWeight: 600 }}
      >
        Manager Dashboard
      </Typography>

      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mt: 2 }}>
        <Button
          variant="contained"
          sx={{
            backgroundColor: "#8d6e63",
            "&:hover": { backgroundColor: "#795548" },
            borderRadius: 3,
            px: 3,
            py: 1,
            fontWeight: 600,
          }}
          onClick={() => navigate("/manager/employees")}
        >
          View Employee List
        </Button>

        <Button
          variant="outlined"
          sx={{
            borderColor: "#8d6e63",
            color: "#5d4037",
            "&:hover": {
              backgroundColor: "#f0eae2",
              borderColor: "#795548",
            },
            borderRadius: 3,
            px: 3,
            py: 1,
            fontWeight: 600,
          }}
          onClick={() => navigate("/manager/reports")}
        >
          Go to Reports
        </Button>
      </Box>
    </Box>
  );
};

export default ManagerDashboard;
