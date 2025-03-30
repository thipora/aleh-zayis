// // import React, { useState, useEffect } from "react";
// // import { Box, Typography, TextField, Button, Container, MenuItem, Select, InputLabel, FormControl } from "@mui/material";
// // import { useNavigate } from "react-router-dom"; // ניווט חזרה
// // import { APIrequests } from "../APIrequests"; // הוספת ה-import של מחלקת ה-APIrequests

// // const AddEmployee = () => {
// //   const [employeeData, setEmployeeData] = useState({
// //     name: "",
// //     email: "",
// //     password: "",
// //     roleId: "", // עדכון לשמירת ID של התפקיד
// //   });
// //   const [roles, setRoles] = useState([]); // רשימת התפקידים
// //   const navigate = useNavigate();

// //   const api = new APIrequests(); // יצירת מופע של מחלקת ה-APIrequests

// //   // טוען את רשימת התפקידים מה-API
// //   useEffect(() => {
// //     const fetchRoles = async () => {
// //       try {
// //         const rolesData = await api.getRequest("/roles"); // שימוש ב-getRequest של מחלקת ה-APIrequests
// //         setRoles(rolesData); // עדכון רשימת התפקידים
// //       } catch (error) {
// //         console.error("Error fetching roles:", error);
// //       }
// //     };

// //     fetchRoles();
// //   }, []);

// //   // עדכון הנתונים בטופס
// //   const handleInputChange = (e) => {
// //     const { name, value } = e.target;
// //     setEmployeeData({ ...employeeData, [name]: value });
// //   };

// //   // שליחה ושמירת העובד החדש
// //   const handleSubmit = async () => {
// //     try {
// //       const response = await api.postRequest("/employees", employeeData); // שליחת הנתונים עם postRequest
// //       alert("Employee created successfully");
// //       navigate("/employee-list"); // לאחר הוספה, חזרה לדף העובדים
// //     } catch (error) {
// //       console.error("Error:", error);
// //       alert("Failed to add employee");
// //     }
// //   };

// //   return (
// //     <Container>
// //       <Box sx={{ padding: 3 }}>
// //         <Typography variant="h4" gutterBottom>
// //           הוסף עובד חדש
// //         </Typography>

// //         <TextField
// //           label="שם העובד"
// //           name="name"
// //           value={employeeData.name}
// //           onChange={handleInputChange}
// //           fullWidth
// //           margin="normal"
// //         />
// //         <TextField
// //           label="אימייל"
// //           name="email"
// //           value={employeeData.email}
// //           onChange={handleInputChange}
// //           fullWidth
// //           margin="normal"
// //         />
// //         <TextField
// //           label="סיסמא"
// //           name="password"
// //           type="password"
// //           value={employeeData.password}
// //           onChange={handleInputChange}
// //           fullWidth
// //           margin="normal"
// //         />

// //         <FormControl fullWidth margin="normal">
// //           <InputLabel>תפקיד</InputLabel>
// //           <Select
// //             name="roleId"
// //             value={employeeData.roleId}
// //             onChange={handleInputChange}
// //           >
// //             {roles.map((role) => (
// //               <MenuItem key={role.id_roles} value={role.id_roles}>
// //                 {role.name}
// //               </MenuItem>
// //             ))}
// //           </Select>
// //         </FormControl>

// //         <Button
// //           variant="contained"
// //           color="primary"
// //           onClick={handleSubmit}
// //           sx={{ marginTop: 2 }}
// //         >
// //           הוסף עובד
// //         </Button>
// //       </Box>
// //     </Container>
// //   );
// // };

// // export default AddEmployee;
// import React, { useState, useEffect } from "react";
// import { Box, Typography, TextField, Button, Container, MenuItem, Select, InputLabel, FormControl } from "@mui/material";
// import { useNavigate } from "react-router-dom"; // ניווט חזרה
// import { APIrequests } from "../APIrequests"; // הוספת ה-import של מחלקת ה-APIrequests

// const AddEmployee = () => {
//   const [employeeData, setEmployeeData] = useState({
//     name: "",
//     email: "",
//     roleId: "", // עדכון לשמירת ID של התפקיד
//   });
//   const [roles, setRoles] = useState([]); // רשימת התפקידים
//   const navigate = useNavigate();

//   const api = new APIrequests(); // יצירת מופע של מחלקת ה-APIrequests

//   // טוען את רשימת התפקידים מה-API
//   useEffect(() => {
//     const fetchRoles = async () => {
//       try {
//         const rolesData = await api.getRequest("/roles"); // שימוש ב-getRequest של מחלקת ה-APIrequests
//         setRoles(rolesData); // עדכון רשימת התפקידים
//       } catch (error) {
//         console.error("Error fetching roles:", error);
//       }
//     };

//     fetchRoles();
//   }, []);

//   // עדכון הנתונים בטופס
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setEmployeeData({ ...employeeData, [name]: value });
//   };

//   // שליחה ושמירת העובד החדש
//   const handleSubmit = async () => {
//     try {
//       // שליחה של הנתונים ל-API, הסיסמא תתווסף בשרת
//       const response = await api.postRequest("/employees", employeeData);
//       alert("Employee created successfully");
//       navigate("/employee-list"); // לאחר הוספה, חזרה לדף העובדים
//     } catch (error) {
//       console.error("Error:", error);
//       alert("Failed to add employee");
//     }
//   };

//   return (
//     <Container>
//       <Box sx={{ padding: 3 }}>
//         <Typography variant="h4" gutterBottom>
//           הוסף עובד חדש
//         </Typography>

//         <TextField
//           label="שם העובד"
//           name="name"
//           value={employeeData.name}
//           onChange={handleInputChange}
//           fullWidth
//           margin="normal"
//         />
//         <TextField
//           label="אימייל"
//           name="email"
//           value={employeeData.email}
//           onChange={handleInputChange}
//           fullWidth
//           margin="normal"
//         />

//         <FormControl fullWidth margin="normal">
//           <InputLabel>תפקיד</InputLabel>
//           <Select
//             name="roleId"
//             value={employeeData.roleId}
//             onChange={handleInputChange}
//           >
//             {roles.map((role) => (
//               <MenuItem key={role.id_roles} value={role.id_roles}>
//                 {role.name}
//               </MenuItem>
//             ))}
//           </Select>
//         </FormControl>

//         <Button
//           variant="contained"
//           color="primary"
//           onClick={handleSubmit}
//           sx={{ marginTop: 2 }}
//         >
//           הוסף עובד
//         </Button>
//       </Box>
//     </Container>
//   );
// };

// export default AddEmployee;


import React, { useState, useEffect } from "react";
import { Box, Typography, TextField, Button, Container, MenuItem, Select, InputLabel, FormControl } from "@mui/material";
import { useNavigate } from "react-router-dom"; // ניווט חזרה
import { APIrequests } from "../APIrequests"; // הוספת ה-import של מחלקת ה-APIrequests

const AddEmployee = () => {
  const [employeeData, setEmployeeData] = useState({
    name: "",
    email: "",
    role: "", // עדכון לשם של תפקיד
  });
  const [roles, setRoles] = useState([]); // רשימת התפקידים
  const navigate = useNavigate();

  const api = new APIrequests(); // יצירת מופע של מחלקת ה-APIrequests

  // טוען את רשימת התפקידים מה-API
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const rolesData = await api.getRequest("/roles"); // שימוש ב-getRequest של מחלקת ה-APIrequests
        setRoles(rolesData); // עדכון רשימת התפקידים
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
    };

    fetchRoles();
  }, []);


  // עדכון הנתונים בטופס
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEmployeeData({ ...employeeData, [name]: value });
  };

  // שליחה ושמירת העובד החדש
  const handleSubmit = async () => {
    try {
      // שליחה של הנתונים ל-API, הסיסמא תתווסף בשרת
      const response = await api.postRequest("/employees", employeeData);
      alert("Employee created successfully");
      navigate("/employee-list"); // לאחר הוספה, חזרה לדף העובדים
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to add employee");
    }
  };

  return (
    <Container>
      <Box sx={{ padding: 3 }}>
        <Typography variant="h4" gutterBottom>
          הוסף עובד חדש
        </Typography>

        <TextField
          label="שם העובד"
          name="name"
          value={employeeData.name}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="אימייל"
          name="email"
          value={employeeData.email}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />

        <FormControl fullWidth margin="normal">
          <InputLabel>תפקיד</InputLabel>
          <Select
            name="role"
            value={employeeData.role}
            onChange={handleInputChange}
          >
            {roles.map((role) => (
              <MenuItem key={role.id_role} value={role.id_role}>
                {role.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          sx={{ marginTop: 2 }}
        >
          הוסף עובד
        </Button>
      </Box>
    </Container>
  );
};

export default AddEmployee;
