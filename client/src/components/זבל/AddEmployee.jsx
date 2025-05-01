// import React, { useState, useEffect } from "react";
// import { Box, Typography, TextField, Button, Container, MenuItem, Select, InputLabel, FormControl } from "@mui/material";
// import { useNavigate } from "react-router-dom"; // Navigate back
// import { APIrequests } from "../../APIrequests"; // Importing the APIrequests class

// const AddEmployee = () => {
//   const [employeeData, setEmployeeData] = useState({
//     name: "",
//     email: "",
//     role: "", // Role name update
//   });
//   const [roles, setRoles] = useState([]); // List of roles
//   const [errors, setErrors] = useState({ name: "", email: "", role: "" }); // Error messages for validation
//   const navigate = useNavigate();

//   const api = new APIrequests(); // Creating an instance of the APIrequests class

//   // Fetching roles from the API
//   useEffect(() => {
//     const fetchRoles = async () => {
//       try {
//         const rolesData = await api.getRequest("/roles"); // Using the getRequest method from the APIrequests class
//         setRoles(rolesData); // Update the list of roles
//       } catch (error) {
//         console.error("Error fetching roles:", error);
//       }
//     };

//     fetchRoles();
//   }, []);

//   // Updating the input fields
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setEmployeeData({ ...employeeData, [name]: value });
//   };

//   // Validating form fields
//   const validateForm = () => {
//     let isValid = true;
//     let errors = { name: "", email: "", role: "" };

//     if (!employeeData.name) {
//       errors.name = "Name is required";
//       isValid = false;
//     }

//     if (!employeeData.email) {
//       errors.email = "Email is required";
//       isValid = false;
//     }

//     if (!employeeData.role) {
//       errors.role = "Role is required";
//       isValid = false;
//     }

//     setErrors(errors);
//     return isValid;
//   };

//   // Submit and save new employee
//   const handleSubmit = async () => {
//     if (validateForm()) {
//       try {
//         // Sending the data to the API, password will be added on the server
//         const response = await api.postRequest("/employees", employeeData);
//         alert("Employee created successfully");
//         navigate("/employee-list"); // After adding, navigate back to employee list
//       } catch (error) {
//         console.error("Error:", error);
//         alert("Failed to add employee");
//       }
//     }
//   };

//   return (
//     <Container>
//       <Box sx={{ padding: 3 }}>
//         <Typography variant="h4" gutterBottom>
//           Add New Employee
//         </Typography>

//         <TextField
//           label="Employee Name"
//           name="name"
//           value={employeeData.name}
//           onChange={handleInputChange}
//           fullWidth
//           margin="normal"
//           error={Boolean(errors.name)} // Show error if field is invalid
//           helperText={errors.name} // Display error message
//         />
//         <TextField
//           label="Email"
//           name="email"
//           value={employeeData.email}
//           onChange={handleInputChange}
//           fullWidth
//           margin="normal"
//           error={Boolean(errors.email)} // Show error if field is invalid
//           helperText={errors.email} // Display error message
//         />

//         <FormControl fullWidth margin="normal" error={Boolean(errors.role)}>
//           <InputLabel>Role</InputLabel>
//           <Select
//             name="role"
//             value={employeeData.role}
//             onChange={handleInputChange}
//           >
//             {roles.map((role) => (
//               <MenuItem key={role.id_role} value={role.id_role}>
//                 {role.name}
//               </MenuItem>
//             ))}
//           </Select>
//           {errors.role && <Typography color="error">{errors.role}</Typography>} {/* Display error message for role */}
//         </FormControl>

//         <Button
//           variant="contained"
//           color="primary"
//           onClick={handleSubmit}
//           sx={{ marginTop: 2 }}
//         >
//           Add Employee
//         </Button>
//       </Box>
//     </Container>
//   );
// };

// export default AddEmployee;
