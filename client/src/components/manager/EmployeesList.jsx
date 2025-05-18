
import React, { useEffect, useState } from "react";
import {
  Typography, Paper, Box, CircularProgress, Button, Table, TableHead,
  TableBody, TableRow, TableCell
} from "@mui/material";
import { APIrequests } from "../../APIrequests";
import WorkEntries from "../WorkEntries/WorkEntries.jsx";
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
