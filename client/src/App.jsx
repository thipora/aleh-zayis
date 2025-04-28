import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import Login from "./components/Login.jsx";   // עדכון אם שינית את השם או המיקום
import Register from "./components/Register.jsx";   // עדכון אם שינית את השם או המיקום

import EmployeeDashboard from "./components/EmployeeDashboard"; // עדכון אם שינית את השם או המיקום
// import DashboardManager from "./components/DashboardManager"; // עדכון אם שינית את השם או המיקום
// import DashboardClient from "./components/DashboardClient"; // עדכון אם שינית את השם או המיקום
import WorkEntries from "./components/WorkEntries"; // עדכון אם שינית את השם או המיקום
import ManagerPage from "./components/ManagerPage"; // עדכון אם שינית את השם או המיקום
import ClientPage from "./components/ClientPage"; // עדכון אם שינית את השם או המיקום
import EmployeeList from "./components/EmployeeList.jsx";
import AddEmployee from "./components/AddEmployee.jsx";
import ChangePassword from "./components/ChangePassword.jsx";
// import "react-datepicker/dist/react-datepicker.css";
import ReportsDashboard from "./components/ReportsDashboard.jsx"; // מיקום הקובץ





const App = () => {
  return (
    <div>
      <h1>Welcome to Aleh Zayis</h1>
      {/* כאן ניתן להוסיף קישורים אם רוצים לנוע בין דפים */}
      {/* <nav>
        <Link to="/login">התחבר</Link>
      </nav> */}

      <Routes>
        {/* <Route path="/login" element={<LoginPage />} />
        <Route path="/employee-dashboard" element={<EmployeeDashboard />} />
        <Route path="/manager-dashboard" element={<ManagerPage />} />
        <Route path="/client-dashboard" element={<ClientPage />} />
        <Route path="/add-work-log" element={<AddWorkEntrie />} /> */}

        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard/employee" element={<EmployeeDashboard />} />
        {/* <Route path="/dashboard/manager" element={<DashboardManager />} />
        <Route path="/dashboard/client" element={<DashboardClient />} /> */}
        <Route path="/workEntrie/add" element={<WorkEntries />} />
        <Route path="/manager" element={<ManagerPage />} />
        <Route path="/employee-list" element={<EmployeeList />} />
        <Route path="/add-employee" element={<AddEmployee />} />
        <Route path="/client" element={<ClientPage />} />
        <Route path="/password" element={<ChangePassword />} />
        <Route path="/reports" element={<ReportsDashboard />} />


      </Routes>
    </div>
  );
};

export default App;
