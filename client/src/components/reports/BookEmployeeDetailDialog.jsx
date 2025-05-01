// import React, { useState, useEffect } from "react";
// import {
//   Dialog, DialogTitle, DialogContent, DialogActions, Button, Table, TableBody, TableCell, TableHead, TableRow, CircularProgress
// } from "@mui/material";
// import { APIrequests } from "../../APIrequests";

// function hoursToString(hours) {
//   const h = Math.floor(hours);
//   const m = Math.round((hours - h) * 60);
//   if (h && m) return `${h} שעות ו-${m} דקות`;
//   if (h) return `${h} שעות`;
//   return `${m} דקות`;
// }

// const BookEmployeeDetailDialog = ({ open, book, employee, month, year, allTime, onClose }) => {
//   const [works, setWorks] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const apiRequests = new APIrequests();

//   useEffect(() => {
//     if (!open) return;
//     const fetchWorks = async () => {
//       setLoading(true);
//       try {
//         let url = `/workEntries/reports/book/${book.book_id}/employee/${employee.employee_id}`;
//         if (!allTime) url += `?month=${month}&year=${year}`;
//         const data = await apiRequests.getRequest(url);
//         setWorks(data);
//       } catch {
//         setWorks([]);
//       }
//       setLoading(false);
//     };
//     fetchWorks();
//     // eslint-disable-next-line
//   }, [open, book, employee, month, year, allTime]);

//   return (
//     <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
//       <DialogTitle>
//         פירוט עבודה עבור {employee ? employee.employee_name : ""} בספר: {book ? `${book.book_name} - ${book.book_id}` : ""}
//       </DialogTitle>
//       <DialogContent>
//         {loading && <CircularProgress />}
//         {!loading && (
//           <Table>
//             <TableHead>
//               <TableRow>
//                 <TableCell>תאריך</TableCell>
//                 <TableCell>כמות</TableCell>
//                 <TableCell>תיאור</TableCell>
//                 <TableCell>הערות</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {works.map((w, i) => (
//                 <TableRow key={i}>
//                   <TableCell>{w.date?.split("T")[0]}</TableCell>
//                   <TableCell>{hoursToString(Number(w.quantity))}</TableCell>
//                   <TableCell>{w.description}</TableCell>
//                   <TableCell>{w.notes}</TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         )}
//       </DialogContent>
//       <DialogActions>
//         <Button onClick={onClose}>סגור</Button>
//       </DialogActions>
//     </Dialog>
//   );
// };

// export default BookEmployeeDetailDialog;
