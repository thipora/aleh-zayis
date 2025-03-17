import React, { useState } from "react";
import { TextField, Button, Typography, Box, Container } from "@mui/material";
import { APIrequests } from "../APIrequests";

const Login = ({ onLogin }) => {
  const [name, setname] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const apiRequests = new APIrequests();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!name || !password) {
      setError("Please fill in all fields");
      return;
    }

    try {
      const data = await apiRequests.postRequest("/auth/login", { name, password });
      // const response = await fetch("/api/auth/login", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ name, password }),
      // });

      // const data = await response.json();
      // if (!response.ok) throw new Error('Error, please try again with different email or password');

      onLogin(data.token);
    } catch (err) {
      setError('Login failed, please try again');
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: 3,
          boxShadow: 3,
          borderRadius: 2,
        }}
      >
        <Typography variant="h4" gutterBottom>
          Login
        </Typography>
        {error && (
          <Typography color="error" variant="body2" gutterBottom>
            {error}
          </Typography>
        )}
        <form onSubmit={handleSubmit} style={{ width: "100%" }}>
          <TextField
            fullWidth
            label="name"
            value={name}
            onChange={(e) => setname(e.target.value)}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
            required
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
          >
            Login
          </Button>
        </form>
        <Typography variant="body2" mt={2}>
          Don't have an account? <a href="/register">Sign up</a>
        </Typography>
      </Box>
    </Container>
  );
};

export default Login;
