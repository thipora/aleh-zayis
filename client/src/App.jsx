import React, { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import { Routes, Route } from 'react-router-dom';


import Login from "./components/auth/Login.jsx";
import Register from "./components/auth/Register.jsx";
import ForgotPassword from "./components/auth/ForgotPassword.jsx";

import EmployeeDashboard from "./components/employees/EmployeeDashboard.jsx";
import ManagerDashboard from "./components/manager/ManagerDashboard.jsx";
import ClientPage from "./components/Admin/ClientPage.jsx";
import ReportsDashboard from "./components/reports/ReportsDashboard.jsx";
import EmployeeList from "./components/manager/EmployeesList.jsx";
import EmployeeWorkPage from "./components/manager/EmployeeWorkPage.jsx";
import i18n from './i18n/i18n.js';
import LanguageSwitcher from './LanguageSwitcher.jsx'
import PrivateRoute from "./components/auth/PrivateRoute";



const App = () => {
  useEffect(() => {
    document.body.dir = i18n.language === 'he' ? 'rtl' : 'ltr';
  }, [i18n.language]);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#fdf9f3",
        px: { xs: 2, sm: 4, md: 6 },
        py: { xs: 3, sm: 6 },
      }}
    >
      <Box dir="ltr" sx={{ display: 'flex', justifyContent: 'flex-end', p: 2 }}>
        <LanguageSwitcher />
      </Box>

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
        <Route path="/password" element={<ForgotPassword />} />

        <Route path="/employee" element={<PrivateRoute  allowedRoles={["Employee"]}>  <EmployeeDashboard/> </PrivateRoute>} />
        <Route path="/manager" element={<PrivateRoute allowedRoles={["Manager"]}>  <ManagerDashboard /> </PrivateRoute>} />
        <Route path="/client" element={<PrivateRoute allowedRoles={["Client"]}>  <ClientPage /> </PrivateRoute>} />

        <Route path="/manager/employees" element={<PrivateRoute allowedRoles={["Manager"]}>  <EmployeeList/> </PrivateRoute>} />
        <Route path="/manager/reports" element={<PrivateRoute allowedRoles={["Manager"]} >  <ReportsDashboard/> </PrivateRoute>} />
        <Route path="/manager/employee/:id/work" element={<PrivateRoute allowedRoles={["Manager"]}>  <EmployeeWorkPage/> </PrivateRoute>} />
      </Routes>
    </Box>
  );
};

export default App;
