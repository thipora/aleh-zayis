// // import React, { useState } from "react";
// // import { TextField, Button, Typography, Box, Container } from "@mui/material";
// // import { APIrequests } from "../APIrequests";

// // const Login = ({ onLogin }) => {
// //   const [name, setname] = useState("");
// //   const [password, setPassword] = useState("");
// //   const [error, setError] = useState("");

// //   const apiRequests = new APIrequests();

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     setError("");

// //     if (!name || !password) {
// //       setError("Please fill in all fields");
// //       return;
// //     }

// //     try {
// //       const data = await apiRequests.postRequest("/auth/login", { name, password });
// //       // const response = await fetch("/api/auth/login", {
// //       //   method: "POST",
// //       //   headers: { "Content-Type": "application/json" },
// //       //   body: JSON.stringify({ name, password }),
// //       // });

// //       // const data = await response.json();
// //       // if (!response.ok) throw new Error('Error, please try again with different email or password');

// //       onLogin(data.token);
// //     } catch (err) {
// //       setError('Login failed, please try again');
// //     }
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
// //             label="name"
// //             value={name}
// //             onChange={(e) => setname(e.target.value)}
// //             margin="normal"
// //             required
// //           />
// //           <TextField
// //             fullWidth
// //             label="Password"
// //             type="password"
// //             value={password}
// //             onChange={(e) => setPassword(e.target.value)}
// //             margin="normal"
// //             required
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
// import { TextField, Button, Typography, Box, Container } from "@mui/material";
// import { APIrequests } from "../APIrequests"; // הנחתה שה-APIrequests שלך כולל פונקציות לשליחה

// const Login = ({ onLogin }) => {
//   const [name, setname] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
  
//   const apiRequests = new APIrequests();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError(""); // לאפס את השגיאה אם יש

//     // אם אחד מהשדות ריקים
//     if (!name || !password) {
//       setError("Please fill in all fields");
//       return;
//     }

//     try {
//       // שליחת הבקשה לשרת
//       const data = await apiRequests.postRequest("/auth/login", { name, password });
      
//       // שולחים את הטוקן לאפליקציה (הנחת שהמשתמש עובר את תהליך ההתחברות בהצלחה)
//       onLogin(data.token);
//     } catch (err) {
//       // טיפול בשגיאה אם לא הצלחנו להתחבר
//       setError("Login failed, please try again");
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
//           Login
//         </Typography>
        
//         {/* הצגת שגיאה אם יש */}
//         {error && (
//           <Typography color="error" variant="body2" gutterBottom>
//             {error}
//           </Typography>
//         )}
        
//         {/* טופס ההתחברות */}
//         <form onSubmit={handleSubmit} style={{ width: "100%" }}>
//           <TextField
//             fullWidth
//             label="Username"
//             value={name}
//             onChange={(e) => setname(e.target.value)}
//             margin="normal"
//             required
//           />
          
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

//         {/* לינק להרשמה אם אין חשבון */}
//         <Typography variant="body2" mt={2}>
//           Don't have an account? <a href="/register">Sign up</a>
//         </Typography>
//       </Box>
//     </Container>
//   );
// };

// export default Login;

import React, { useState } from "react";
import { TextField, Button, Typography, Box, Container } from "@mui/material";
import { APIrequests } from "../APIrequests"; // הנחתה שה-APIrequests שלך כולל פונקציות לשליחה
import { useNavigate } from "react-router-dom"; // מייבא את useNavigate

const Login = ({ onLogin }) => {
  const [name, setname] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  
  const apiRequests = new APIrequests();
  const navigate = useNavigate(); // הגדרת navigate

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // לאפס את השגיאה אם יש

    // אם אחד מהשדות ריקים
    if (!name || !password) {
      setError("Please fill in all fields");
      return;
    }

    try {
      // שליחת הבקשה לשרת
      const data = await apiRequests.postRequest("/auth/login", { name, password });
      
      // שולחים את הטוקן לאפליקציה (הנחת שהמשתמש עובר את תהליך ההתחברות בהצלחה)
      localStorage.setItem("token", data.token); // שומר את הטוקן בלוקאלסטורג
      localStorage.setItem("user", JSON.stringify(data.user)); // שומר את פרטי המשתמש בלוקאלסטורג

      // לאחר ההתחברות, ניתוב לעמוד לפי התפקיד
      switch (data.user.role) {
        case "employee":
          navigate("/dashboard/employee"); // לדף העובד
          break;
        case "manager":
          navigate("/manager"); // לדף המנהל
          break;
        case "client":
          navigate("/client"); // לדף הלקוח
          break;
        default:
          navigate("/"); // אם אין תפקיד, ניתוב לעמוד הבית
      }

      // קריאה לפונקציה onLogin אם יש צורך בה
      onLogin(data.token);

    } catch (err) {
      // טיפול בשגיאה אם לא הצלחנו להתחבר
      setError("Login failed, please try again");
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
        
        {/* הצגת שגיאה אם יש */}
        {error && (
          <Typography color="error" variant="body2" gutterBottom>
            {error}
          </Typography>
        )}
        
        {/* טופס ההתחברות */}
        <form onSubmit={handleSubmit} style={{ width: "100%" }}>
          <TextField
            fullWidth
            label="Username"
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

        {/* לינק להרשמה אם אין חשבון */}
        <Typography variant="body2" mt={2}>
          Don't have an account? <a href="/register">Sign up</a>
        </Typography>
      </Box>
    </Container>
  );
};

export default Login;
