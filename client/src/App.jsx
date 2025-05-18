// // import React from "react";
// // import { Routes, Route, Link } from "react-router-dom";
// // import Login from "./components/auth/Login.jsx";   // עדכון אם שינית את השם או המיקום
// // import Register from "./components/auth/Register.jsx";   // עדכון אם שינית את השם או המיקום

// // import EmployeeDashboard from "./components/employees/EmployeeDashboard.jsx"; // עדכון אם שינית את השם או המיקום
// // // import DashboardManager from "./components/DashboardManager"; // עדכון אם שינית את השם או המיקום
// // // import DashboardClient from "./components/DashboardClient"; // עדכון אם שינית את השם או המיקום
// // // import WorkEntries from "./components/workEntries/WorkEntries.jsx"; // עדכון אם שינית את השם או המיקום
// // import ManagerPage from "./components/manager/ManagerDashboard.jsx"; // עדכון אם שינית את השם או המיקום
// // import ClientPage from "./components/Admin/ClientPage.jsx"; // עדכון אם שינית את השם או המיקום
// // // import EmployeeList from "./components/employees/EmployeeList.jsx";
// // // import AddEmployee from "./components/auth/AddEmployee.jsx";
// // import ChangePassword from "./components/auth/ChangePassword.jsx";
// // // import "react-datepicker/dist/react-datepicker.css";
// // import ReportsDashboard from "./components/reports/ReportsDashboard.jsx"; // מיקום הקובץ
// // import EmployeesReport from "./components/reports/EmployeesReport.jsx"; // מיקום הקובץ
// // import RateManagement from "./components/manager/RateManagement.jsx"
// // import ManagerDashboard from "./components/manager/ManagerDashboard.jsx";
// // import EmployeeList from "./components/manager/EmployeesList.jsx"
// // import EmployeeWorkPage from "./components/manager/EmployeeWorkPage.jsx";



// // const App = () => {
// //   return (
// //     <div>
// //       <h1>Welcome to Aleh Zayis</h1>
// //       {/* כאן ניתן להוסיף קישורים אם רוצים לנוע בין דפים */}
// //       {/* <nav>
// //         <Link to="/login">התחבר</Link>
// //       </nav> */}

// //       <Routes>


// //         {/* גישה לכולם */}
// //         <Route path="/" element={<Login />} />
// //         <Route path="/login" element={<Login />} />
// //         <Route path="/register" element={<Register />} />
// //         <Route path="/change-password" element={<ChangePassword />} />

// //         <Route path="/employee" element={<EmployeeDashboard />} />
// //         {/* <Route path="/workEntrie/add" element={<WorkEntries />} /> */}
// //         {/* <Route path="/manager" element={<ManagerDashboard />} /> */}
// //         <Route path="/manager" element={ <ManagerDashboard />} />

// //         <Route path="/manager/reports" element={<ReportsDashboard />} />
// //         <Route path="/manager/employees" element={<EmployeeList />} />
// //         <Route path="/manager/employee/:id/work" element={<EmployeeWorkPage />} />


// //         <Route path="/client" element={<ClientPage />} />

// //       </Routes>
// //     </div>
// //   );
// // };

// // export default App;


// import React from "react";
// import { Routes, Route } from "react-router-dom";
// import { Box, Typography, Container } from "@mui/material";

// import Login from "./components/auth/Login.jsx";
// import Register from "./components/auth/Register.jsx";
// import ChangePassword from "./components/auth/ChangePassword.jsx";

// import EmployeeDashboard from "./components/employees/EmployeeDashboard.jsx";
// import ManagerDashboard from "./components/manager/ManagerDashboard.jsx";
// import ClientPage from "./components/Admin/ClientPage.jsx";
// import ReportsDashboard from "./components/reports/ReportsDashboard.jsx";
// import EmployeesReport from "./components/reports/EmployeesReport.jsx";
// import RateManagement from "./components/manager/RateManagement.jsx";
// import EmployeeList from "./components/manager/EmployeesList.jsx";
// import EmployeeWorkPage from "./components/manager/EmployeeWorkPage.jsx";

// const App = () => {
//   return (
//     <Box sx={{ bgcolor: "background.default", minHeight: "100vh", py: 4 }}>
//       <Container maxWidth="md">
//         <Typography
//           variant="h3"
//           align="center"
//           gutterBottom
//           sx={{ color: "#5d4037", fontWeight: 700 }}
//         >
//           Aleh Zayis System
//         </Typography>

//         <Routes>
//           {/* גישה לכולם */}
//           <Route path="/" element={<Login />} />
//           <Route path="/login" element={<Login />} />
//           <Route path="/register" element={<Register />} />
//           <Route path="/change-password" element={<ChangePassword />} />

//           {/* דשבורדים */}
//           <Route path="/employee" element={<EmployeeDashboard />} />
//           <Route path="/manager" element={<ManagerDashboard />} />
//           <Route path="/client" element={<ClientPage />} />

//           {/* ניהול עובדים ודוחות */}
//           <Route path="/manager/employees" element={<EmployeeList />} />
//           <Route path="/manager/reports" element={<ReportsDashboard />} />
//           <Route path="/manager/employee/:id/work" element={<EmployeeWorkPage />} />
//         </Routes>
//       </Container>
//     </Box>
//   );
// };

// export default App;
import React from "react";
import { Routes, Route } from "react-router-dom";
import { Box, Typography } from "@mui/material";

import Login from "./components/auth/Login.jsx";
import Register from "./components/auth/Register.jsx";
import ChangePassword from "./components/auth/ChangePassword.jsx";

import EmployeeDashboard from "./components/employees/EmployeeDashboard.jsx";
import ManagerDashboard from "./components/manager/ManagerDashboard.jsx";
import ClientPage from "./components/Admin/ClientPage.jsx";
import ReportsDashboard from "./components/reports/ReportsDashboard.jsx";
import EmployeesReport from "./components/reports/EmployeesReport.jsx";
import RateManagement from "./components/manager/RateManagement.jsx";
import EmployeeList from "./components/manager/EmployeesList.jsx";
import EmployeeWorkPage from "./components/manager/EmployeeWorkPage.jsx";

const App = () => {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#fdf9f3",
        px: { xs: 2, sm: 4, md: 6 },
        py: { xs: 3, sm: 6 },
      }}
    >
      <Typography
        variant="h2"
        align="center"
        gutterBottom
        sx={{
          color: "#4e342e",
          fontWeight: 700,
          fontFamily: "'Rubik', 'Assistant', sans-serif",
        }}
      >
        Aleh Zayis
      </Typography>

      <Typography
        variant="h6"
        align="center"
        sx={{ color: "#6d4c41", mb: 4 }}
      >
Complete publishing services for today’s Torah community
      </Typography>

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/change-password" element={<ChangePassword />} />

        <Route path="/employee" element={<EmployeeDashboard />} />
        <Route path="/manager" element={<ManagerDashboard />} />
        <Route path="/client" element={<ClientPage />} />

        <Route path="/manager/employees" element={<EmployeeList />} />
        <Route path="/manager/reports" element={<ReportsDashboard />} />
        <Route path="/manager/employee/:id/work" element={<EmployeeWorkPage />} />
      </Routes>
    </Box>
  );
};

export default App;
