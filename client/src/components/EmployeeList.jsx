// import React, { useState, useEffect } from "react";
// import { Box, Typography, Button, Container } from "@mui/material";
// import { useNavigate } from "react-router-dom";
// import { APIrequests } from '../APIrequests'; // הוספת קריאה ל-APIrequests.js

// const EmployeeList = () => {
//   const [employees, setEmployees] = useState([]);
//   const navigate = useNavigate();
//   const apiRequests = new APIrequests(); // יצירת אובייקט של APIrequests

//   // טוען את רשימת העובדים מה-API
//   useEffect(() => {
//     const fetchEmployees = async () => {
//       try {
//         // קריאה ל-API דרך getRequest לשליפת העובדים
//         const data = await apiRequests.getRequest('/employees'); 
//         setEmployees(data); // עדכון רשימת העובדים
//       } catch (error) {
//         console.error("Error fetching employees:", error);
//       }
//     };

//     fetchEmployees();
//   }, []);

//   // ניווט לדף הוספת עובד
//   const handleAddEmployee = () => {
//     navigate("/add-employee"); // ניווט לדף הוספת עובד
//   };

//   return (
//     <Container>
//       <Box sx={{ padding: 3 }}>
//         <Typography variant="h4" gutterBottom>
//           רשימת עובדים
//         </Typography>

//         {/* הצגת העובדים */}
//         <Box mb={2}>
//           {employees.map((employee) => (
//             <Box key={employee.id} mb={1}>
//               <Typography variant="h6">{employee.name}</Typography>
//               <Typography variant="body1">{employee.role}</Typography>
//             </Box>
//           ))}
//         </Box>

//         {/* כפתור להוספת עובד חדש */}
//         <Button
//           variant="contained"
//           color="primary"
//           onClick={handleAddEmployee} // קריאה לפונקציה להוספת עובד
//         >
//           הוסף עובד חדש
//         </Button>
//       </Box>
//     </Container>
//   );
// };

// export default EmployeeList;
import React, { useState, useEffect } from "react";
import { Box, Typography, Button, Container, Card, CardContent } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { APIrequests } from '../APIrequests'; // הוספת קריאה ל-APIrequests.js

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const navigate = useNavigate();
  const apiRequests = new APIrequests(); // יצירת אובייקט של APIrequests

  // טוען את רשימת העובדים מה-API
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        // קריאה ל-API דרך getRequest לשליפת העובדים
        const data = await apiRequests.getRequest('/employees'); 
        setEmployees(data); // עדכון רשימת העובדים
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };

    fetchEmployees();
  }, []);

  // ניווט לדף הוספת עובד
  const handleAddEmployee = () => {
    navigate("/add-employee"); // ניווט לדף הוספת עובד
  };

  return (
    <Container>
      <Box sx={{ padding: 3 }}>
        <Typography variant="h4" gutterBottom>
          רשימת עובדים
        </Typography>

        {/* הצגת העובדים */}
        <Box mb={2}>
          {employees.map((employee) => (
            <Card key={employee.id_employee} sx={{ marginBottom: 2 }}>
              <CardContent>
                <Typography variant="h6">{employee.name}</Typography>
                <Typography variant="body1">תפקיד: {employee.role}</Typography>
                <Typography variant="body2">מייל: {employee.email}</Typography>
              </CardContent>
            </Card>
          ))}
        </Box>

        {/* כפתור להוספת עובד חדש */}
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddEmployee} // קריאה לפונקציה להוספת עובד
        >
          הוסף עובד חדש
        </Button>
      </Box>
    </Container>
  );
};

export default EmployeeList;
