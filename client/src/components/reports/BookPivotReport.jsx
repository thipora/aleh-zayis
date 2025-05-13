import React, { useEffect, useState } from "react";
import {
  Box, Typography, Paper, CircularProgress, Table,
  TableBody, TableCell, TableHead, TableRow,
  TextField, Button
} from "@mui/material";
import { APIrequests } from "../../APIrequests";

// מעבד את הנתונים לפורמט מטריצה: שורות = עובדים, עמודות = תפקידים
function transformToMatrix(dataFromServer) {
  const employeeMap = {};
  const rolesSet = new Set();

  dataFromServer.forEach(({ role_name, employees }) => {
    rolesSet.add(role_name);
    employees.forEach(emp => {
      if (!employeeMap[emp.employee_id]) {
        employeeMap[emp.employee_id] = {
          employee_id: emp.employee_id,
          employee_name: emp.employee_name,
          roles: {}
        };
      }
      employeeMap[emp.employee_id].roles[role_name] = emp.total;
    });
  });

  const roles = Array.from(rolesSet);
  const employees = Object.values(employeeMap);

  // מחשב סה"כ לכל עובד
  employees.forEach(emp => {
    emp.total = roles.reduce((sum, role) => sum + (emp.roles[role] || 0), 0);
  });

  // מחשב סה"כ לכל תפקיד
  const totalsByRole = {};
  roles.forEach(role => {
    totalsByRole[role] = employees.reduce((sum, emp) => sum + (emp.roles[role] || 0), 0);
  });
  const grandTotal = employees.reduce((sum, emp) => sum + emp.total, 0);

  return { roles, employees, totalsByRole, grandTotal };
}

const BookMatrixReport = () => {
  const [bookIdInput, setBookIdInput] = useState("");
  const [selectedBookId, setSelectedBookId] = useState("");
  const [matrixData, setMatrixData] = useState(null);
  const [loading, setLoading] = useState(false);

  const api = new APIrequests();

  useEffect(() => {
    const fetchReport = async () => {
      if (!selectedBookId) return;
      setLoading(true);
      try {
        const data = await api.getRequest(`/reports/book-summary/${selectedBookId}`);
        const transformed = transformToMatrix(data);
        setMatrixData(transformed);
      } catch (err) {
        console.error("Failed to load report", err);
      }
      setLoading(false);
    };
    fetchReport();
  }, [selectedBookId]);

  const handleSubmit = () => {
    if (bookIdInput.trim()) {
      setSelectedBookId(bookIdInput.trim());
    }
  };

  return (
    <Box mt={4} maxWidth={1200} mx="auto">
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          דוח תשלום מטריציוני לפי ספר
        </Typography>

        <Box display="flex" gap={2} mb={3}>
          <TextField
            label="Book ID"
            value={bookIdInput}
            onChange={(e) => setBookIdInput(e.target.value)}
            fullWidth
          />
          <Button variant="contained" onClick={handleSubmit}>
            הצג דוח
          </Button>
        </Box>

        {loading ? (
          <CircularProgress />
        ) : (
          matrixData && (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>שם עובד</TableCell>
                  {matrixData.roles.map(role => (
                    <TableCell key={role} align="center">{role}</TableCell>
                  ))}
                  <TableCell align="center"><strong>Total</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {matrixData.employees.map((emp, i) => (
                  <TableRow key={i}>
                    <TableCell>{emp.employee_name}</TableCell>
                    {matrixData.roles.map(role => (
                      <TableCell key={role} align="center">
                        {emp.roles[role] ? emp.roles[role].toFixed(2) : ""}
                      </TableCell>
                    ))}
                    <TableCell align="center"><strong>{emp.total.toFixed(2)}</strong></TableCell>
                  </TableRow>
                ))}
                <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                  <TableCell sx={{ fontWeight: "bold" }}>סה"כ לכל תפקיד</TableCell>
                  {matrixData.roles.map(role => (
                    <TableCell key={role} align="center" sx={{ fontWeight: "bold" }}>
                      {matrixData.totalsByRole[role].toFixed(2)}
                    </TableCell>
                  ))}
                  <TableCell align="center" sx={{ fontWeight: "bold" }}>
                    {matrixData.grandTotal.toFixed(2)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          )
        )}
      </Paper>
    </Box>
  );
};

export default BookMatrixReport;
