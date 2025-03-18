


// // import Login from "./components/Login";

// // function App() {
// //   return <Login onLogin={(email, password) => console.log(email, password)} />;
// // }

// // export default App;

// import { BrowserRouter as Router, Route,Routes } from 'react-router-dom';
// import EmployeeRegister from "./components/EmployeeRegister";
// // import {Login} from "./components/Login";

// function App() {
//   return <EmployeeRegister />;
//   // return (
//   //   <>
//   //     <Router>
//   //       <Routes>
//   //         {/* <Route path="/" element={<Home />} />
//   //         <Route path="/Home" element={<Home />} />
//   //         <Route path="businesses">
//   //           <Route index element={<Businesses />} />
//   //           <Route path=':idBusiness' element={<Business />} />
//   //           <Route path='register' element={<BusinessRegister />} />
//   //           <Route path='login' element={<BusinessLogin />} />
//   //           <Route path='personal-area' element={<PersonalArea />} />
//   //         </Route> */}



//   //         <Route path="/employeeRegister" element={<EmployeeRegister />} />
//   //         <Route path="/" element={<EmployeeRegister />} />

//   //         {/* <Route path="/login" element={<Login />} /> */}
//   //       </Routes>
//   //     </Router>
//   //   </>
//   // )

// }

// export default App;



// import React from "react";
// import { Routes, Route, Link } from "react-router-dom"; // נתיב, רכיב ה-Link ו-Routes
// import {LoginPage} from "./components/Login.jsx";
// import EmployeeDashboard from "./components/EmployeeDashboard.jsx";
// import ManagerPage from "./components/ManagerPage.jsx";  // עמוד ריק למנהל
// import ClientPage from "./components/ClientPage.jsx";    // עמוד ריק ללקוח
// import AddWorkLog from "./components/AddWorkLog";              // עמוד הוספת עבודה

import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import Login from "./components/Login";   // עדכון אם שינית את השם או המיקום
import EmployeeDashboard from "./components/EmployeeDashboard"; // עדכון אם שינית את השם או המיקום
// import DashboardManager from "./components/DashboardManager"; // עדכון אם שינית את השם או המיקום
// import DashboardClient from "./components/DashboardClient"; // עדכון אם שינית את השם או המיקום
import WorkLogs from "./components/WorkLogs"; // עדכון אם שינית את השם או המיקום
import ManagerPage from "./components/ManagerPage"; // עדכון אם שינית את השם או המיקום
import ClientPage from "./components/ClientPage"; // עדכון אם שינית את השם או המיקום


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
        <Route path="/dashboard/employee" element={<EmployeeDashboard />} />
        {/* <Route path="/dashboard/manager" element={<DashboardManager />} />
        <Route path="/dashboard/client" element={<DashboardClient />} /> */}
        <Route path="/worklog/add" element={<WorkLogs />} />
        <Route path="/manager" element={<ManagerPage />} />
        <Route path="/client" element={<ClientPage />} />
      </Routes>
    </div>
  );
};

export default App;
