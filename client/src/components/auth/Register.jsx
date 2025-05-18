// import React, { useState } from "react";
// import {
//   TextField,
//   Button,
//   Typography,
//   Box,
//   Container
// } from "@mui/material";
// import { useNavigate } from 'react-router-dom';
// import { APIrequests } from "../../APIrequests";


// const Register = () => {
//   const [formData, setFormData] = useState({ name: "", email: "" });
//   const [error, setError] = useState("");
//   const [successMsg, setSuccessMsg] = useState("");
//   const [loading, setLoading] = useState(false); // ⬅️ משתנה לטעינה
//   const navigate = useNavigate();

//   const apiRequests = new APIrequests();

//   const handleChange = (e) => {
//     setFormData(prev => ({
//       ...prev,
//       [e.target.name]: e.target.value
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (loading) return; // ⬅️ אם כבר יש בקשה – אל תמשיך
//     setLoading(true);     // ⬅️ מתחילים שליחה

//     setError("");
//     setSuccessMsg("");

//     try {
//       await apiRequests.postRequest("/auth/register", formData);
//       setSuccessMsg("Registration successful! Check your email for your password.");
//       setTimeout(() => navigate("/login"), 3000);
//     } catch (err) {
//       setError(err.response?.data?.message || "Registration failed, please try again.");
//     } finally {
//       setLoading(false); // ⬅️ סיום הבקשה – מחזיר ללחיץ
//     }
//   };


//   return (
//     <Container component="main" maxWidth="xs">
//       <Box
//         sx={{
//           display: "flex",
//           flexDirection: "column",
//           alignItems: "center",
//           padding: 3,
//           boxShadow: 3,
//           borderRadius: 2,
//         }}
//       >
//         <Typography variant="h4" gutterBottom>
//           Register
//         </Typography>

//         {error && (
//           <Typography color="error" variant="body2" gutterBottom>
//             {error}
//           </Typography>
//         )}
//         {successMsg && (
//           <Typography color="primary" variant="body2" gutterBottom>
//             {successMsg}
//           </Typography>
//         )}

//         <form onSubmit={handleSubmit} style={{ width: "100%" }}>
//           <TextField
//             fullWidth
//             label="Name"
//             name="name"
//             value={formData.name}
//             onChange={handleChange}
//             margin="normal"
//             required
//           />
//           <TextField
//             fullWidth
//             label="Email"
//             name="email"
//             type="email"
//             value={formData.email}
//             onChange={handleChange}
//             margin="normal"
//             required
//           />
//           <Button
//             type="submit"
//             variant="contained"
//             color="primary"
//             fullWidth
//             sx={{ mt: 2 }}
//             disabled={loading} // ⬅️ חסימה בזמן טעינה
//           >
//             {loading ? "Registering..." : "Register"}
//           </Button>
//         </form>

//         <Typography variant="body2" mt={2}>
//           Already have an account? <a href="/login">Login</a>
//         </Typography>
//       </Box>
//     </Container>
//   );
// };

// export default Register;


import React, { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Box,
  Paper
} from "@mui/material";
import { useNavigate } from 'react-router-dom';
import { APIrequests } from "../../APIrequests";

const Register = () => {
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const apiRequests = new APIrequests();

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setError("");
    setSuccessMsg("");

    try {
      await apiRequests.postRequest("/auth/register", formData);
      setSuccessMsg("Registration successful! Check your email for your password.");
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed, please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        bgcolor: "#fdf9f3",
        minHeight: "calc(100vh - 300px)", // מניח שיש כותרת בגובה 64px
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        px: 2,
        py: 4,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 5,
          borderRadius: 4,
          bgcolor: "#ffffff",
          boxShadow: "0 6px 24px rgba(0,0,0,0.08)",
          width: "100%",
          maxWidth: 420,
        }}
      >
        <Typography
          variant="h4"
          align="center"
          sx={{ color: "#5d4037", fontWeight: 600, mb: 2 }}
        >
          Register
        </Typography>

        {error && (
          <Typography color="error" variant="body2" align="center" sx={{ mb: 1 }}>
            {error}
          </Typography>
        )}
        {successMsg && (
          <Typography color="primary" variant="body2" align="center" sx={{ mb: 1 }}>
            {successMsg}
          </Typography>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            margin="normal"
            required
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              mt: 3,
              backgroundColor: "#8d6e63",
              "&:hover": { backgroundColor: "#795548" },
              borderRadius: 3,
              py: 1.5,
              fontWeight: 600,
            }}
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </Button>
        </form>

        <Typography variant="body2" align="center" sx={{ mt: 3 }}>
          Already have an account?{" "}
          <a href="/login" style={{ color: "#5d4037", fontWeight: 500 }}>
            Login
          </a>
        </Typography>
      </Paper>
    </Box>
  );
};

export default Register;
