import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import Login from "./components/auth/Login.jsx";   // עדכון אם שינית את השם או המיקום
import Register from "./components/auth/Register.jsx";   // עדכון אם שינית את השם או המיקום

import EmployeeDashboard from "./components/employees/EmployeeDashboard.jsx"; // עדכון אם שינית את השם או המיקום
// import DashboardManager from "./components/DashboardManager"; // עדכון אם שינית את השם או המיקום
// import DashboardClient from "./components/DashboardClient"; // עדכון אם שינית את השם או המיקום
// import WorkEntries from "./components/workEntries/WorkEntries.jsx"; // עדכון אם שינית את השם או המיקום
import ManagerPage from "./components/manager/ManagerDashboard.jsx"; // עדכון אם שינית את השם או המיקום
import ClientPage from "./components/Admin/ClientPage.jsx"; // עדכון אם שינית את השם או המיקום
// import EmployeeList from "./components/employees/EmployeeList.jsx";
// import AddEmployee from "./components/auth/AddEmployee.jsx";
import ChangePassword from "./components/auth/ChangePassword.jsx";
// import "react-datepicker/dist/react-datepicker.css";
import ReportsDashboard from "./components/reports/ReportsDashboard.jsx"; // מיקום הקובץ
import MonthlyEmployeesSummary from "./components/reports/MonthlyEmployeesSummary.jsx"; // מיקום הקובץ
import RateManagement from "./components/manager/RateManagement.jsx"
import ManagerDashboard from "./components/manager/ManagerDashboard.jsx";
import EmployeeList from "./components/manager/EmployeesList.jsx"
import EmployeeWorkPage from "./components/manager/EmployeeWorkPage.jsx";



const App = () => {
  return (
    <div>
      <h1>Welcome to Aleh Zayis</h1>
      {/* כאן ניתן להוסיף קישורים אם רוצים לנוע בין דפים */}
      {/* <nav>
        <Link to="/login">התחבר</Link>
      </nav> */}

      <Routes>


        {/* גישה לכולם */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/change-password" element={<ChangePassword />} />

        <Route path="/employee" element={<EmployeeDashboard />} />
        {/* <Route path="/workEntrie/add" element={<WorkEntries />} /> */}
        {/* <Route path="/manager" element={<ManagerDashboard />} /> */}
        <Route path="/manager" element={ <ManagerDashboard />} />

        <Route path="/manager/reports" element={<ReportsDashboard />} />
        <Route path="/manager/employees" element={<EmployeeList />} />
        <Route path="/manager/employee/:id/work" element={<EmployeeWorkPage />} />


        <Route path="/client" element={<ClientPage />} />

      </Routes>
    </div>
  );
};

export default App;
