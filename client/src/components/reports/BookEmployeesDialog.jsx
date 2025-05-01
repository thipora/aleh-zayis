// import React, { useState, useEffect } from "react";
// import {
//   Dialog, DialogTitle, DialogContent, DialogActions, Button, Table, TableBody, TableCell, TableHead, TableRow, CircularProgress
// } from "@mui/material";
// import { APIrequests } from "../../APIrequests";
// import BookEmployeeDetailDialog from "./BookEmployeeDetailDialog";

// function hoursToString(hours) {
//   const h = Math.floor(hours);
//   const m = Math.round((hours - h) * 60);
//   if (h && m) return `${h} שעות ו-${m} דקות`;
//   if (h) return `${h} שעות`;
//   return `${m} דקות`;
// }

// const BookEmployeesDialog = ({ open, book, month, year, allTime, onClose }) => {
//   const [employees, setEmployees] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [selectedEmployee, setSelectedEmployee] = useState(null);

//   const apiRequests = new APIrequests();

//   useEffect(() => {
//     if (!open) return;
//     const fetchEmployees = async () => {
//       setLoading(true);
//       try {
//         let url = `/workEntries/reports/book/${book.book_id}`;
//         if (!allTime) url += `?month=${month}&year=${year}`;
//         const data = await apiRequests.getRequest(url);
//         setEmployees(data);
//       } catch {
//         setEmployees([]);
//       }
//       setLoading(false);
//     };
//     fetchEmployees();
//     // eslint-disable-next-line
//   }, [open, book, month, year, allTime]);

//   return (
//     <>
//       <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
//         <DialogTitle>
//           פירוט עובדים לספר: {book ? `${book.book_name} - ${book.book_id}` : ""}
//         </DialogTitle>
//         <DialogContent>
//           {loading && <CircularProgress />}
//           {!loading && (
//             <Table>
//               <TableHead>
//                 <TableRow>
//                   <TableCell>שם עובד</TableCell>
//                   <TableCell align="center">סה"כ שעות</TableCell>
//                   <TableCell align="center">פירוט</TableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {employees.map(emp => (
//                   <TableRow key={emp.employee_id}>
//                     <TableCell>{emp.employee_name}</TableCell>
//                     <TableCell align="center">{hoursToString(emp.total_hours)}</TableCell>
//                     <TableCell align="center">
//                       <Button
//                         variant="outlined"
//                         size="small"
//                         onClick={() => setSelectedEmployee(emp)}
//                       >
//                         פירוט
//                       </Button>
//                     </TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           )}
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={onClose}>סגור</Button>
//         </DialogActions>
//       </Dialog>
//       {/* דיאלוג פירוט עובד */}
//       {selectedEmployee && (
//         <BookEmployeeDetailDialog
//           open={!!selectedEmployee}
//           book={book}
//           employee={selectedEmployee}
//           month={month}
//           year={year}
//           allTime={allTime}
//           onClose={() => setSelectedEmployee(null)}
//         />
//       )}
//     </>
//   );
// };

// export default BookEmployeesDialog;
