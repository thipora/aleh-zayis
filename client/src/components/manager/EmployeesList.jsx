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
//       const entries = await api.getRequest(`/workEntries/${employee.id_employee}`);
//       setWorkEntries(entries);
//     } catch (error) {
//       console.error("Error fetching work entries:", error);
//     }
//     setLoading(false);
//   };

//   const refreshEntries = async () => {
//     if (!selectedEmployee) return;
//     const entries = await api.getRequest(`/workEntries/${selectedEmployee.id_employee}`);
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
//               <ListItemText
//                 primary={emp.name}
//                 secondary={
//                   <>
//                     <Typography variant="body2" color="text.secondary">
//                       {emp.email}
//                     </Typography>
//                     <Typography variant="body2" color="text.secondary">
//                       {emp.roles.join(", ")}
//                     </Typography>
//                   </>
//                 }
//               />
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
//               <WorkEntries workEntries={workEntries} allowUpdate = {false} />
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
  Typography, Paper, Box, CircularProgress, Button, Table, TableHead,
  TableBody, TableRow, TableCell
} from "@mui/material";
import { APIrequests } from "../../APIrequests";
import WorkEntries from "../WorkEntries/WorkEntries";
import RateDialog from "./RateDialog";
import { useNavigate } from "react-router-dom";

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [workEntries, setWorkEntries] = useState([]);
  const [loadingEntries, setLoadingEntries] = useState(false);
  const [openRateDialog, setOpenRateDialog] = useState(false);
  const navigate = useNavigate();

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

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Employee Management
      </Typography>

      <Paper sx={{ mb: 4, overflowX: 'auto' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Availability Status</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Roles</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {employees.map(emp => (
              <TableRow key={emp.id_employee}>
                <TableCell>{emp.name}</TableCell>
                <TableCell>{emp.availability_status}</TableCell>
                <TableCell>{emp.email}</TableCell>
                <TableCell>{emp.roles.join(", ")}</TableCell>
                <TableCell align="center">
                  <Button
                    variant="outlined"
                    size="small"
                    sx={{ mr: 1 }}
                    onClick={() => navigate(`/manager/employee/${emp.id_employee}/work`, { state: { name: emp.name } })}
                  >
                    View Work
                  </Button>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => {
                      setSelectedEmployee(emp);
                      setOpenRateDialog(true);
                    }}
                  >
                    Edit Rates
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      {/* Work Entries section */}
      {selectedEmployee && (
        <Box>
          <Typography variant="h5" gutterBottom>
            {selectedEmployee.name} – Work Entries
          </Typography>
          {loadingEntries ? (
            <CircularProgress />
          ) : (
            <WorkEntries workEntries={workEntries} allowUpdate={false} />
          )}
        </Box>
      )}

      {/* Rate dialog */}
      {selectedEmployee && (
        <RateDialog
          open={openRateDialog}
          onClose={() => setOpenRateDialog(false)}
          employeeId={selectedEmployee.id_employee}
          employeeName={selectedEmployee.name}
        />
      )}
    </Box>
  );
};

export default EmployeeList;
