// import React, { useEffect, useState } from "react";
// import {
//   Box, Typography, Paper, Table, TableHead, TableRow, TableCell, TableBody, CircularProgress
// } from "@mui/material";
// import { APIrequests } from "../../APIrequests";

// const BookSummaryReport = ({ bookId, bookName, onBack }) => {
//   const [loading, setLoading] = useState(true);
//   const [groupedData, setGroupedData] = useState({});
//   const api = new APIrequests();

//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);
//       try {
//         const data = await api.getRequest(`/reports/book-summary/${bookId}`);
//         const grouped = {};
//         for (const row of data) {
//           if (!grouped[row.role_name]) {
//             grouped[row.role_name] = [];
//           }
//           grouped[row.role_name].push(row);
//         }
//         setGroupedData(grouped);
//       } catch (err) {
//         console.error("Error fetching book summary:", err);
//       }
//       setLoading(false);
//     };
//     fetchData();
//   }, [bookId]);

//   return (
//     <Box mt={3} maxWidth={1000} mx="auto">
//       <Paper sx={{ p: 3 }}>
//         <Typography variant="h5" gutterBottom>
//           סיכום עבור ספר: {bookName} ({bookId})
//         </Typography>
//         <Typography variant="body2" onClick={onBack} sx={{ color: "blue", cursor: "pointer", mb: 2 }}>
//           ← חזור לרשימת הספרים
//         </Typography>

//         {loading ? (
//           <CircularProgress />
//         ) : (
//           Object.entries(groupedData).map(([role, employees]) => (
//             <Box key={role} mb={4}>
//               <Typography variant="h6" sx={{ mt: 2 }}>{role}</Typography>
//               <Table>
//                 <TableHead>
//                   <TableRow>
//                     <TableCell>שם עובד</TableCell>
//                     <TableCell align="center">כמות</TableCell>
//                     <TableCell align="center">תעריף</TableCell>
//                     <TableCell align="center">תשלום</TableCell>
//                   </TableRow>
//                 </TableHead>
//                 <TableBody>
//                   {employees.map((emp, i) => (
//                     <TableRow key={i}>
//                       <TableCell>{emp.employee_name}</TableCell>
//                       <TableCell align="center">{emp.total_quantity}</TableCell>
//                       <TableCell align="center">{emp.rate} ₪</TableCell>
//                       <TableCell align="center">{(emp.total_quantity * emp.rate).toFixed(2)} ₪</TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </Box>
//           ))
//         )}
//       </Paper>
//     </Box>
//   );
// };

// export default BookSummaryReport;
