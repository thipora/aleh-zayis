// // import React, { useState } from "react";
// // import { TextField, Button, Typography, Box, Container, InputAdornment, IconButton } from "@mui/material";
// // import { APIrequests } from "../../APIrequests";
// // import { useNavigate } from 'react-router-dom';
// // import Visibility from '@mui/icons-material/Visibility';
// // import VisibilityOff from '@mui/icons-material/VisibilityOff';

// // const Login = ({ onLogin }) => {
// //   const navigate = useNavigate();

// //   const [email, setEmail] = useState("");
// //   const [password, setPassword] = useState("");
// //   const [error, setError] = useState("");
// //   const [showPassword, setShowPassword] = useState(false);
// //   const apiRequests = new APIrequests();

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     setError("");

// //     if (!email || !password) {
// //       setError("Please fill in all fields");
// //       return;
// //     }

// //     try {
// //       const data = await apiRequests.postRequest("/auth/login", { email, password });

// //       localStorage.setItem("user", JSON.stringify(data.user));

// //       switch (data.user.account_type) {
// //         case "Employee":
// //           navigate("/employee");
// //           break;
// //         case "Manager":
// //           navigate("/manager");
// //           break;
// //         case "Client":
// //           navigate("/client");
// //           break;
// //         default:
// //           navigate("/");
// //       }
// //     } catch (err) {
// //       console.log(err);
// //       setError('Login failed, please try again');
// //     }
// //   };

// //   const handleClickShowPassword = () => {
// //     setShowPassword(!showPassword);
// //   };

// //   return (
// //     <Container component="main" maxWidth="xs">
// //       <Box
// //         sx={{
// //           display: "flex",
// //           flexDirection: "column",
// //           alignItems: "center",
// //           padding: 3,
// //           boxShadow: 3,
// //           borderRadius: 2,
// //         }}
// //       >
// //         <Typography variant="h4" gutterBottom>
// //           Login
// //         </Typography>
// //         {error && (
// //           <Typography color="error" variant="body2" gutterBottom>
// //             {error}
// //           </Typography>
// //         )}
// //         <form onSubmit={handleSubmit} style={{ width: "100%" }}>
// //           <TextField
// //             fullWidth
// //             label="Email"
// //             value={email}
// //             onChange={(e) => setEmail(e.target.value)}
// //             margin="normal"
// //             required
// //           />
// //           <TextField
// //             fullWidth
// //             label="Password"
// //             type={showPassword ? "text" : "password"}
// //             value={password}
// //             onChange={(e) => setPassword(e.target.value)}
// //             margin="normal"
// //             required
// //             InputProps={{
// //               endAdornment: (
// //                 <InputAdornment position="end">
// //                   <IconButton
// //                     onClick={handleClickShowPassword}
// //                     edge="end"
// //                   >
// //                     {showPassword ? <VisibilityOff /> : <Visibility />}
// //                   </IconButton>
// //                 </InputAdornment>
// //               ),
// //             }}
// //           />
// //           <Button
// //             type="submit"
// //             variant="contained"
// //             color="primary"
// //             fullWidth
// //             sx={{ mt: 2 }}
// //           >
// //             Login
// //           </Button>
// //           <Typography variant="body2" align="right" sx={{ mt: 1 }}>
// //             <a href="/password" style={{ textDecoration: 'underline', cursor: 'pointer' }}>
// //               Forgot your password?
// //             </a>
// //           </Typography>
// //         </form>
// //         <Typography variant="body2" mt={2}>
// //           Don't have an account? <a href="/register">Sign up</a>
// //         </Typography>
// //       </Box>
// //     </Container>
// //   );
// // };

// // export default Login;

// import React, { useState } from "react";
// import {
//   TextField, Button, Typography, Box, Container,
//   InputAdornment, IconButton, Paper
// } from "@mui/material";
// import { APIrequests } from "../../APIrequests";
// import { useNavigate } from 'react-router-dom';
// import Visibility from '@mui/icons-material/Visibility';
// import VisibilityOff from '@mui/icons-material/VisibilityOff';

// const Login = ({ onLogin }) => {
//   const navigate = useNavigate();

//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const apiRequests = new APIrequests();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");

//     if (!email || !password) {
//       setError("Please fill in all fields");
//       return;
//     }

//     try {
//       const data = await apiRequests.postRequest("/auth/login", { email, password });

//       localStorage.setItem("user", JSON.stringify(data.user));

//       switch (data.user.account_type) {
//         case "Employee":
//           navigate("/employee");
//           break;
//         case "Manager":
//           navigate("/manager");
//           break;
//         case "Client":
//           navigate("/client");
//           break;
//         default:
//           navigate("/");
//       }
//     } catch (err) {
//       console.log(err);
//       setError("Login failed, please try again");
//     }
//   };

//   const handleClickShowPassword = () => {
//     setShowPassword(!showPassword);
//   };

//   return (
//     <Container maxWidth="sm" sx={{ mt: 10 }}>
//       <Paper
//         elevation={4}
//         sx={{
//           p: 5,
//           borderRadius: 4,
//           bgcolor: "#fdf9f3",
//           border: "1px solid #c2b49a",
//           boxShadow: "0 4px 20px rgba(0,0,0,0.08)"
//         }}
//       >
//         <Box
//           sx={{
//             display: "flex",
//             flexDirection: "column",
//             alignItems: "center",
//             gap: 2,
//           }}
//         >
//           <Typography variant="h4" sx={{ color: "#5d4037", fontWeight: 600 }}>
//             Login
//           </Typography>

//           {error && (
//             <Typography color="error" variant="body2">
//               {error}
//             </Typography>
//           )}

//           <form onSubmit={handleSubmit} style={{ width: "100%" }}>
//             <TextField
//               fullWidth
//               label="Email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               margin="normal"
//               required
//             />
//             <TextField
//               fullWidth
//               label="Password"
//               type={showPassword ? "text" : "password"}
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               margin="normal"
//               required
//               InputProps={{
//                 endAdornment: (
//                   <InputAdornment position="end">
//                     <IconButton onClick={handleClickShowPassword} edge="end">
//                       {showPassword ? <VisibilityOff /> : <Visibility />}
//                     </IconButton>
//                   </InputAdornment>
//                 ),
//               }}
//             />
//             <Button
//               type="submit"
//               variant="contained"
//               fullWidth
//               sx={{
//                 mt: 3,
//                 backgroundColor: "#8d6e63",
//                 "&:hover": { backgroundColor: "#795548" },
//                 borderRadius: 3,
//                 py: 1.5,
//                 fontWeight: 600,
//               }}
//             >
//               Login
//             </Button>

//             <Typography
//               variant="body2"
//               align="right"
//               sx={{ mt: 1, color: "#5d4037" }}
//             >
//               <a href="/password" style={{ textDecoration: "underline", color: "#5d4037" }}>
//                 Forgot your password?
//               </a>
//             </Typography>
//           </form>

//           <Typography variant="body2" mt={2}>
//             Don't have an account?{" "}
//             <a href="/register" style={{ color: "#5d4037", fontWeight: 500 }}>
//               Sign up
//             </a>
//           </Typography>
//         </Box>
//       </Paper>
//     </Container>
//   );
// };

// export default Login;
import React, { useState } from "react";
import {
  TextField, Button, Typography, Box,
  InputAdornment, IconButton, Paper
} from "@mui/material";
import { APIrequests } from "../../APIrequests";
import { useNavigate } from 'react-router-dom';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const Login = ({ onLogin }) => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const apiRequests = new APIrequests();

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
          navigate("/employee");
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
      setError("Login failed, please try again");
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
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
        <Typography variant="h4" align="center" sx={{ color: "#5d4037", fontWeight: 600, mb: 2 }}>
          Login
        </Typography>

        {error && (
          <Typography color="error" variant="body2" align="center" sx={{ mb: 1 }}>
            {error}
          </Typography>
        )}

        <form onSubmit={handleSubmit}>
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
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
            required
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleClickShowPassword} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
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
          >
            Login
          </Button>

          <Typography
            variant="body2"
            align="right"
            sx={{ mt: 1, color: "#5d4037" }}
          >
            <a href="/password" style={{ textDecoration: "underline", color: "#5d4037" }}>
              Forgot your password?
            </a>
          </Typography>
        </form>

        <Typography variant="body2" align="center" sx={{ mt: 3 }}>
          Don't have an account?{" "}
          <a href="/register" style={{ color: "#5d4037", fontWeight: 500 }}>
            Sign up
          </a>
        </Typography>
      </Paper>
    </Box>
  );
};

export default Login;
