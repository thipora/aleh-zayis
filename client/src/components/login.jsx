// import React, { useState } from "react";
// import { TextField, Button, Typography, Box, Container } from "@mui/material";
// import { APIrequests } from "../APIrequests";
// import CryptoJS from 'crypto-js';
// import { useNavigate } from 'react-router-dom';


// const Login = ({ onLogin }) => {
//   const navigate = useNavigate();

//   // const [name, setname] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");

//   const apiRequests = new APIrequests();


//   const generatePasswordHash = (password) => {
//     return CryptoJS.SHA256(password).toString();
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");

//     if (!email || !password) {
//         setError("Please fill in all fields");
//         return;
//     }

//     try {
//         const data = await apiRequests.postRequest("/auth/login", { email, password });

//         localStorage.setItem("user", JSON.stringify(data.user));

//         switch (data.user.account_type) {
//             case "Employee":
//                 navigate("/dashboard/employee");
//                 break;
//             case "Manager":
//                 navigate("/manager");
//                 break;
//             case "Client":
//                 navigate("/client");
//                 break;
//             default:
//                 navigate("/");
//         }
//     } catch (err) {
//         console.log(err);
//         setError('Login failed, please try again');
//     }
// };


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
//           Login
//         </Typography>
//         {error && (
//           <Typography color="error" variant="body2" gutterBottom>
//             {error}
//           </Typography>
//         )}
//         <form onSubmit={handleSubmit} style={{ width: "100%" }}>
//           {/* <TextField
//             fullWidth
//             label="name"
//             value={name}
//             onChange={(e) => setname(e.target.value)}
//             margin="normal"
//             required
//           /> */}
//           <TextField
//   fullWidth
//   label="Email"
//   value={email}
//   onChange={(e) => setEmail(e.target.value)}
//   margin="normal"
//   required
// />

//           <TextField
//             fullWidth
//             label="Password"
//             type="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             margin="normal"
//             required
//           />
//           <Button
//             type="submit"
//             variant="contained"
//             color="primary"
//             fullWidth
//             sx={{ mt: 2 }}
//           >
//             Login
//           </Button>
//         </form>
//         <Typography variant="body2" mt={2}>
//           Don't have an account? <a href="/register">Sign up</a>
//         </Typography>
//       </Box>
//     </Container>
//   );
// };

// export default Login;
import React, { useState } from "react";
import { TextField, Button, Typography, Box, Container, InputAdornment, IconButton } from "@mui/material";
import { APIrequests } from "../APIrequests";
import CryptoJS from 'crypto-js';
import { useNavigate } from 'react-router-dom';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const Login = ({ onLogin }) => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(true);  // משתנה למעקב אחר מצב התצוגה של הסיסמה

  const apiRequests = new APIrequests();

  const generatePasswordHash = (password) => {
    return CryptoJS.SHA256(password).toString();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    try {
      const data = await apiRequests.postRequest("/auth/login", { email, password });

      localStorage.setItem("user", JSON.stringify(data.user));

      switch (data.user.account_type) {
        case "Employee":
          navigate("/dashboard/employee");
          break;
        case "Manager":
          navigate("/manager");
          break;
        case "Client":
          navigate("/client");
          break;
        default:
          navigate("/");
      }
    } catch (err) {
      console.log(err);
      setError('Login failed, please try again');
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);  // החלפה בין הצגת הסיסמה להסתתרותה
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
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Password"
            type={showPassword ? "password" : "text"}  // שינוי סוג השדה לפי מצב הצגת הסיסמה
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
            required
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton 
                    onClick={handleClickShowPassword} 
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
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
