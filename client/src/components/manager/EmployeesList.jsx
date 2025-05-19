
// // import React, { useEffect, useState } from "react";
// // import {
// //   Typography, Paper, Box, CircularProgress, Button, Table, TableHead,
// //   TableBody, TableRow, TableCell
// // } from "@mui/material";
// // import { APIrequests } from "../../APIrequests";
// // import WorkEntries from "../WorkEntries/WorkEntries.jsx";
// // import RateDialog from "./RateDialog";
// // import { useNavigate } from "react-router-dom";

// // const EmployeeList = () => {
// //   const [employees, setEmployees] = useState([]);
// //   const [selectedEmployee, setSelectedEmployee] = useState(null);
// //   const [workEntries, setWorkEntries] = useState([]);
// //   const [loadingEntries, setLoadingEntries] = useState(false);
// //   const [openRateDialog, setOpenRateDialog] = useState(false);
// //   const navigate = useNavigate();

// //   const api = new APIrequests();

// //   useEffect(() => {
// //     const fetchEmployees = async () => {
// //       try {
// //         const data = await api.getRequest("/employees");
// //         setEmployees(data);
// //       } catch (error) {
// //         console.error("Error fetching employees:", error);
// //       }
// //     };
// //     fetchEmployees();
// //   }, []);

// //   return (
// //     <Box sx={{ p: 3 }}>
// //       <Typography variant="h4" gutterBottom>
// //         Employee Management
// //       </Typography>

// //       <Paper sx={{ mb: 4, overflowX: 'auto' }}>
// //         <Table>
// //           <TableHead>
// //             <TableRow>
// //               <TableCell>Name</TableCell>
// //               <TableCell>Availability Status</TableCell>
// //               <TableCell>Email</TableCell>
// //               <TableCell>Roles</TableCell>
// //               <TableCell align="center">Actions</TableCell>
// //             </TableRow>
// //           </TableHead>
// //           <TableBody>
// //             {employees.map(emp => (
// //               <TableRow key={emp.id_employee}>
// //                 <TableCell>{emp.name}</TableCell>
// //                 <TableCell>{emp.availability_status}</TableCell>
// //                 <TableCell>{emp.email}</TableCell>
// //                 <TableCell>{emp.roles.join(", ")}</TableCell>
// //                 <TableCell align="center">
// //                   <Button
// //                     variant="outlined"
// //                     size="small"
// //                     sx={{ mr: 1 }}
// //                     onClick={() => navigate(`/manager/employee/${emp.id_employee}/work`, { state: { name: emp.name } })}
// //                   >
// //                     View Work
// //                   </Button>
// //                   <Button
// //                     variant="contained"
// //                     size="small"
// //                     onClick={() => {
// //                       setSelectedEmployee(emp);
// //                       setOpenRateDialog(true);
// //                     }}
// //                   >
// //                     Edit Rates
// //                   </Button>
// //                 </TableCell>
// //               </TableRow>
// //             ))}
// //           </TableBody>
// //         </Table>
// //       </Paper>

// //       {/* Rate dialog */}
// //       {selectedEmployee && (
// //         <RateDialog
// //           open={openRateDialog}
// //           onClose={() => setOpenRateDialog(false)}
// //           employeeId={selectedEmployee.id_employee}
// //           employeeName={selectedEmployee.name}
// //         />
// //       )}
// //     </Box>
// //   );
// // };

// // export default EmployeeList;


// import React, { useEffect, useState } from "react";
// import {
//   Typography, Paper, Box, CircularProgress, Button, Table, TableHead,
//   TableBody, TableRow, TableCell, TextField, FormControl, InputLabel, Select, MenuItem
// } from "@mui/material";
// import { APIrequests } from "../../APIrequests";
// import WorkEntries from "../WorkEntries/WorkEntries.jsx";
// import RateDialog from "./RateDialog";
// import { useNavigate } from "react-router-dom";

// const EmployeeList = () => {
//   const [employees, setEmployees] = useState([]);
//   const [selectedEmployee, setSelectedEmployee] = useState(null);
//   const [openRateDialog, setOpenRateDialog] = useState(false);
//   const [filterName, setFilterName] = useState("");
//   const [filterAvailability, setFilterAvailability] = useState("");
//   const [filterRole, setFilterRole] = useState("");
//   const navigate = useNavigate();
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

//   const filteredEmployees = employees.filter(emp => {
//     const matchName = emp.name.toLowerCase().includes(filterName.toLowerCase());
//     const matchAvailability = filterAvailability ? emp.availability_status === filterAvailability : true;
//     const matchRole = filterRole ? emp.roles.includes(filterRole) : true;
//     return matchName && matchAvailability && matchRole;
//   });

//   // שליפה של כל התפקידים האפשריים מתוך הרשימה עצמה
//   const allRoles = [...new Set(employees.flatMap(emp => emp.roles))];

//   return (
//     <Box sx={{ p: 3 }}>
//       <Typography variant="h4" gutterBottom>
//         Employee Management
//       </Typography>

//       {/* Filters */}
//       <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
//         <TextField
//           label="Search by Name"
//           value={filterName}
//           onChange={(e) => setFilterName(e.target.value)}
//         />
//         {/* <FormControl sx={{ minWidth: 150 }}>
//           <InputLabel>Availability</InputLabel>
//           <Select
//             value={filterAvailability}
//             label="Availability"
//             onChange={(e) => setFilterAvailability(e.target.value)}
//           >
//             <MenuItem value="">All</MenuItem>
//             <MenuItem value="Available">Available</MenuItem>
//             <MenuItem value="Unavailable">Unavailable</MenuItem>
//           </Select>
//         </FormControl> */}

//         <FormControl sx={{ minWidth: 150 }}>
//   <InputLabel>Availability</InputLabel>
//   <Select
//     value={filterAvailability}
//     label="Availability"
//     onChange={(e) => setFilterAvailability(e.target.value)}
//   >
//     <MenuItem value="">All</MenuItem>
//     <MenuItem value="available">Available</MenuItem>
//     <MenuItem value="partial">Partial</MenuItem>
//     <MenuItem value="not_available">Not Available</MenuItem>
//   </Select>
// </FormControl>

//         <FormControl sx={{ minWidth: 150 }}>
//           <InputLabel>Role</InputLabel>
//           <Select
//             value={filterRole}
//             label="Role"
//             onChange={(e) => setFilterRole(e.target.value)}
//           >
//             <MenuItem value="">All</MenuItem>
//             {allRoles.map((role, i) => (
//               <MenuItem key={i} value={role}>{role}</MenuItem>
//             ))}
//           </Select>
//         </FormControl>
//       </Box>

//       <Paper sx={{ mb: 4, overflowX: 'auto' }}>
//         <Table>
//           <TableHead>
//             <TableRow>
//               <TableCell>Name</TableCell>
//               <TableCell>Availability Status</TableCell>
//               <TableCell>Email</TableCell>
//               <TableCell>Roles</TableCell>
//               <TableCell align="center">Actions</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {filteredEmployees.map(emp => (
//               <TableRow key={emp.id_employee}>
//                 <TableCell>{emp.name}</TableCell>
//                 <TableCell>{emp.availability_status}</TableCell>
//                 <TableCell>{emp.email}</TableCell>
//                 <TableCell>{emp.roles.join(", ")}</TableCell>
//                 <TableCell align="center">
//                   <Button
//                     variant="outlined"
//                     size="small"
//                     sx={{ mr: 1 }}
//                     onClick={() => navigate(`/manager/employee/${emp.id_employee}/work`, { state: { name: emp.name } })}
//                   >
//                     View Work
//                   </Button>
//                   <Button
//                     variant="contained"
//                     size="small"
//                     onClick={() => {
//                       setSelectedEmployee(emp);
//                       setOpenRateDialog(true);
//                     }}
//                   >
//                     Edit Rates
//                   </Button>
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </Paper>

//       {/* Rate dialog */}
//       {selectedEmployee && (
//         <RateDialog
//           open={openRateDialog}
//           onClose={() => setOpenRateDialog(false)}
//           employeeId={selectedEmployee.id_employee}
//           employeeName={selectedEmployee.name}
//         />
//       )}
//     </Box>
//   );
// };

// export default EmployeeList;
import React, { useEffect, useState } from "react";
import {
  Typography, Paper, Box, Button, Table, TableHead,
  TableBody, TableRow, TableCell, TextField, FormControl, InputLabel, Select, MenuItem
} from "@mui/material";
import { APIrequests } from "../../APIrequests";
import WorkEntries from "../WorkEntries/WorkEntries.jsx";
import RateDialog from "./RateDialog";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const EmployeeList = () => {
  const { t } = useTranslation();
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [openRateDialog, setOpenRateDialog] = useState(false);
  const [filterName, setFilterName] = useState("");
  const [filterAvailability, setFilterAvailability] = useState("");
  const [filterRole, setFilterRole] = useState("");
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

  const filteredEmployees = employees.filter(emp => {
    const matchName = emp.name.toLowerCase().includes(filterName.toLowerCase());
    const matchAvailability = filterAvailability ? emp.availability_status === filterAvailability : true;
    const matchRole = filterRole ? emp.roles.includes(filterRole) : true;
    return matchName && matchAvailability && matchRole;
  });

  const allRoles = [...new Set(employees.flatMap(emp => emp.roles))];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        {t("employeeList.title")}
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
        <TextField
          label={t("employeeList.searchName")}
          value={filterName}
          onChange={(e) => setFilterName(e.target.value)}
        />

        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>{t("employeeList.availability")}</InputLabel>
          <Select
            value={filterAvailability}
            label={t("employeeList.availability")}
            onChange={(e) => setFilterAvailability(e.target.value)}
          >
            <MenuItem value="">{t("employeeList.all")}</MenuItem>
            <MenuItem value="available">{t("employeeList.available")}</MenuItem>
            <MenuItem value="partial">{t("employeeList.partial")}</MenuItem>
            <MenuItem value="not_available">{t("employeeList.notAvailable")}</MenuItem>
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>{t("employeeList.role")}</InputLabel>
          <Select
            value={filterRole}
            label={t("employeeList.role")}
            onChange={(e) => setFilterRole(e.target.value)}
          >
            <MenuItem value="">{t("employeeList.all")}</MenuItem>
            {allRoles.map((role, i) => (
              <MenuItem key={i} value={role}>{role}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Paper sx={{ mb: 4, overflowX: 'auto' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{t("employeeList.name")}</TableCell>
              <TableCell>{t("employeeList.availabilityStatus")}</TableCell>
              <TableCell>{t("employeeList.email")}</TableCell>
              <TableCell>{t("employeeList.roles")}</TableCell>
              <TableCell align="center">{t("employeeList.actions")}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredEmployees.map(emp => (
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
                    onClick={() =>
                      navigate(`/manager/employee/${emp.id_employee}/work`, {
                        state: { name: emp.name },
                      })
                    }
                  >
                    {t("employeeList.viewWork")}
                  </Button>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => {
                      setSelectedEmployee(emp);
                      setOpenRateDialog(true);
                    }}
                  >
                    {t("employeeList.editRates")}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

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
