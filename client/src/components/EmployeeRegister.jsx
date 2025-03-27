import { useState } from "react";
import { Container, Card, CardContent, TextField, Button, Typography } from "@mui/material";

export default function EmployeeRegister() {
  const [employee, setEmployee] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
    password: ""
  });

  const handleChange = (e) => {
    setEmployee({ ...employee, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/employees/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(employee),
      });
      if (!response.ok) throw new Error("Failed to register");
      alert("Registration request sent!");
      setEmployee({ name: "", email: "", phone: "", role: "", password: "" });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Container maxWidth="sm" style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      <Card style={{ padding: "20px", width: "100%" }}>
        <CardContent>
          <Typography variant="h5" align="center" gutterBottom>
            Employee Registration
          </Typography>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            <TextField label="Name" name="name" value={employee.name} onChange={handleChange} required fullWidth />
            <TextField label="Email" type="email" name="email" value={employee.email} onChange={handleChange} required fullWidth />
            <TextField label="Phone" name="phone" value={employee.phone} onChange={handleChange} required fullWidth />
            <TextField label="Role" name="role" value={employee.role} onChange={handleChange} required fullWidth />
            <TextField label="Password" type="password" name="password" value={employee.password} onChange={handleChange} required fullWidth />
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Register
            </Button>
          </form>
        </CardContent>
      </Card>
    </Container>
  );
}
