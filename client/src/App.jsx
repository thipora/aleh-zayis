import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import Login from "./components/Login.jsx";   // עדכון אם שינית את השם או המיקום
import Register from "./components/Register.jsx";   // עדכון אם שינית את השם או המיקום

import EmployeeDashboard from "./components/EmployeeDashboard"; // עדכון אם שינית את השם או המיקום
// import DashboardManager from "./components/DashboardManager"; // עדכון אם שינית את השם או המיקום
// import DashboardClient from "./components/DashboardClient"; // עדכון אם שינית את השם או המיקום
import WorkLogs from "./components/WorkLogs"; // עדכון אם שינית את השם או המיקום
import ManagerPage from "./components/ManagerPage"; // עדכון אם שינית את השם או המיקום
import ClientPage from "./components/ClientPage"; // עדכון אם שינית את השם או המיקום
import EmployeeList from "./components/EmployeeList.jsx";
import AddEmployee from "./components/AddEmployee.jsx";



const App = () => {
  return (
    <div>
      <h1>ברוכים הבאים לאתר</h1>
      {/* כאן ניתן להוסיף קישורים אם רוצים לנוע בין דפים */}
      <nav>
        <Link to="/login">התחבר</Link>
      </nav>

      <Routes>
        {/* <Route path="/login" element={<LoginPage />} />
        <Route path="/employee-dashboard" element={<EmployeeDashboard />} />
        <Route path="/manager-dashboard" element={<ManagerPage />} />
        <Route path="/client-dashboard" element={<ClientPage />} />
        <Route path="/add-work-log" element={<AddWorkLog />} /> */}

        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard/employee" element={<EmployeeDashboard />} />
        {/* <Route path="/dashboard/manager" element={<DashboardManager />} />
        <Route path="/dashboard/client" element={<DashboardClient />} /> */}
        <Route path="/worklog/add" element={<WorkLogs />} />
        <Route path="/manager" element={<ManagerPage />} />
        <Route path="/employee-list" element={<EmployeeList />} />
        <Route path="/add-employee" element={<AddEmployee />} />
        <Route path="/client" element={<ClientPage />} />
      </Routes>
    </div>
  );
};

export default App;
