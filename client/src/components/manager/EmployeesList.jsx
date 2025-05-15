// // import { useEffect, useState } from "react";
// // import { List, ListItem, ListItemText, Typography } from "@mui/material";
// // import { APIrequests } from "../../APIrequests";
// // import EmployeeWorkDetails from "./EmployeeWorkDetails";

// // const EmployeesList = () => {
// //   const [employees, setEmployees] = useState([]);
// //   const [selectedEmployee, setSelectedEmployee] = useState(null);

// //   const api = new APIrequests();

// //   useEffect(() => {
// //     const fetchEmployees = async () => {
// //       const data = await api.getRequest("/employees");
// //       setEmployees(data);
// //     };
// //     fetchEmployees();
// //   }, []);

// //   return (
// //     <div style={{ display: "flex", gap: "2rem" }}>
// //       <List sx={{ width: "250px", borderRight: "1px solid #ccc" }}>
// //         <Typography variant="h6" sx={{ m: 2 }}>
// //           Employees
// //         </Typography>
// //         {employees.map((emp) => (
// //           <ListItem button key={emp.id_employee} onClick={() => setSelectedEmployee(emp)}>
// //             <ListItemText primary={emp.name} />
// //           </ListItem>
// //         ))}
// //       </List>

// //       {selectedEmployee && (
// //         <div style={{ flex: 1 }}>
// //           <EmployeeWorkDetails employee={selectedEmployee} />
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default EmployeesList;


// import React, { useEffect, useState } from "react";
// import {
//   List, ListItem, ListItemText, Typography, Paper, Box, Divider, CircularProgress
// } from "@mui/material";
// import { APIrequests } from "../../APIrequests";
// import WorkEntries from "../WorkEntries/WorkEntries";

// const EmployeeList = () => {
//   const [employees, setEmployees] = useState([]);
//   const [selectedEmployee, setSelectedEmployee] = useState(null);
//   const [workEntries, setWorkEntries] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const api = new APIrequests();

//   useEffect(() => {
//     const fetchEmployees = async () => {
//       try {
//         const data = await api.getRequest("/employees");
//         setEmployees(data);
//       } catch (error) {
//         console.error("Error fetching employees:", error);
//       }
//     };
//     fetchEmployees();
//   }, []);

//   const handleSelectEmployee = async (employee) => {
//     setSelectedEmployee(employee);
//     setLoading(true);
//     try {
//       const entries = await api.getRequest(`/work-entries/by-employee/${employee.id_employee}`);
//       setWorkEntries(entries);
//     } catch (error) {
//       console.error("Error fetching work entries:", error);
//     }
//     setLoading(false);
//   };

//   const refreshEntries = async () => {
//     if (!selectedEmployee) return;
//     const entries = await api.getRequest(`/work-entries/by-employee/${selectedEmployee.id_employee}`);
//     setWorkEntries(entries);
//   };

//   return (
//     <Box sx={{ display: "flex", gap: 3 }}>
//       {/* רשימת עובדים */}
//       <Paper sx={{ width: 250, maxHeight: "80vh", overflow: "auto" }}>
//         <Typography variant="h6" sx={{ p: 2 }}>
//           Employees
//         </Typography>
//         <Divider />
//         <List>
//           {employees.map((emp) => (
//             <ListItem
//               button
//               key={emp.id_employee}
//               onClick={() => handleSelectEmployee(emp)}
//               selected={selectedEmployee?.id_employee === emp.id_employee}
//             >
//               <ListItemText primary={emp.name} />
//             </ListItem>
//           ))}
//         </List>
//       </Paper>

//       {/* דיווחים של העובד */}
//       <Box sx={{ flex: 1 }}>
//         {selectedEmployee ? (
//           <>
//             <Typography variant="h5" gutterBottom>
//               {selectedEmployee.name} – Work Entries
//             </Typography>
//             {loading ? (
//               <CircularProgress />
//             ) : (
//               <WorkEntries workEntries={workEntries} onUpdate={refreshEntries} />
//             )}
//           </>
//         ) : (
//           <Typography variant="h6" sx={{ mt: 5 }}>
//             Select an employee to view work entries
//           </Typography>
//         )}
//       </Box>
//     </Box>
//   );
// };

// export default EmployeeList;

import React, { useEffect, useState } from "react";
import {
  List, ListItem, ListItemText, Typography, Paper, Box, Divider, CircularProgress
} from "@mui/material";
import { APIrequests } from "../../APIrequests";
import WorkEntries from "../WorkEntries/WorkEntries";

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [workEntries, setWorkEntries] = useState([]);
  const [loading, setLoading] = useState(false);

  const api = new APIrequests();

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const data = await api.getRequest("/employees");
        setEmployees(data);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };
    fetchEmployees();
  }, []);

  const handleSelectEmployee = async (employee) => {
    setSelectedEmployee(employee);
    setLoading(true);
    try {
      const entries = await api.getRequest(`/workEntries/${employee.id_employee}`);
      setWorkEntries(entries);
    } catch (error) {
      console.error("Error fetching work entries:", error);
    }
    setLoading(false);
  };

  const refreshEntries = async () => {
    if (!selectedEmployee) return;
    const entries = await api.getRequest(`/workEntries/${selectedEmployee.id_employee}`);
    setWorkEntries(entries);
  };

  return (
    <Box sx={{ display: "flex", gap: 3 }}>
      {/* רשימת עובדים */}
      <Paper sx={{ width: 250, maxHeight: "80vh", overflow: "auto" }}>
        <Typography variant="h6" sx={{ p: 2 }}>
          Employees
        </Typography>
        <Divider />
        <List>
          {employees.map((emp) => (
            <ListItem
              button
              key={emp.id_employee}
              onClick={() => handleSelectEmployee(emp)}
              selected={selectedEmployee?.id_employee === emp.id_employee}
            >
              <ListItemText
                primary={emp.name}
                secondary={
                  <>
                    <Typography variant="body2" color="text.secondary">
                      {emp.email}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {emp.roles.join(", ")}
                    </Typography>
                  </>
                }
              />
            </ListItem>
          ))}
        </List>
      </Paper>

      {/* דיווחים של העובד */}
      <Box sx={{ flex: 1 }}>
        {selectedEmployee ? (
          <>
            <Typography variant="h5" gutterBottom>
              {selectedEmployee.name} – Work Entries
            </Typography>
            {loading ? (
              <CircularProgress />
            ) : (
              <WorkEntries workEntries={workEntries} allowUpdate = {false} />
            )}
          </>
        ) : (
          <Typography variant="h6" sx={{ mt: 5 }}>
            Select an employee to view work entries
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default EmployeeList;
