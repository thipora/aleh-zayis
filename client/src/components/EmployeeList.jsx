import React, { useState, useEffect } from "react";
import { Box, Typography, Button, Container, Card, CardContent, TextField, Grid, MenuItem, Select, InputLabel, FormControl } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { APIrequests } from '../APIrequests'; // Import APIrequests.js

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [searchName, setSearchName] = useState(""); // Search by employee name
  const [searchRole, setSearchRole] = useState(""); // Search by employee role
  const [roles, setRoles] = useState([]); // List of employee roles
  const navigate = useNavigate();
  const apiRequests = new APIrequests(); // Create an instance of APIrequests

  // Fetch employees and roles from the API
  useEffect(() => {
    const fetchEmployeesAndRoles = async () => {
      try {
        // API request to get employees
        const employeeData = await apiRequests.getRequest('/employees'); 
        setEmployees(employeeData); // Update employees list
        setFilteredEmployees(employeeData); // Update filtered employees list

        // API request to get roles
        const rolesData = await apiRequests.getRequest('/roles');
        setRoles(rolesData); // Set the roles list
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchEmployeesAndRoles();
  }, []);

  // Function to filter employees based on name and role
  useEffect(() => {
    const filtered = employees.filter((employee) =>
      employee.name.toLowerCase().includes(searchName.toLowerCase()) &&
      employee.role.toLowerCase().includes(searchRole.toLowerCase())
    );
    setFilteredEmployees(filtered);
  }, [searchName, searchRole, employees]);

  // Navigate to the add employee page
  const handleAddEmployee = () => {
    navigate("/add-employee"); // Navigate to add employee page
  };

  return (
    <Container>
      <Box sx={{ padding: 3 }}>
        <Typography variant="h4" gutterBottom>
          Employee List
        </Typography>

        {/* Search fields within Grid, side by side */}
        <Box mb={3}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                label="Search by Username"
                variant="outlined"
                fullWidth
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                size="small" // Small size
              />
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth size="small">
                <InputLabel>Search by Role</InputLabel>
                <Select
                  value={searchRole}
                  onChange={(e) => setSearchRole(e.target.value)}
                  label="Search by Role"
                >
                  <MenuItem value="">All</MenuItem>
                  {roles.map((role) => (
                    <MenuItem key={role.id_role} value={role.name}>
                      {role.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Box>

        {/* Displaying the employees */}
        <Box mb={2}>
          {filteredEmployees.map((employee) => (
            <Card key={employee.id_employee} sx={{ marginBottom: 2 }}>
              <CardContent>
                <Typography variant="h6">{employee.name}</Typography>
                <Typography variant="body1">Role: {employee.role}</Typography>
                <Typography variant="body2">Email: {employee.email}</Typography>
              </CardContent>
            </Card>
          ))}
        </Box>

        {/* Button to add a new employee */}
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddEmployee} // Call function to add employee
        >
          Add New Employee
        </Button>
      </Box>
    </Container>
  );
};

export default EmployeeList;

