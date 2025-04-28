// import React, { useState, useEffect } from "react";
// import { APIrequests } from "../APIrequests";
// import { Box, Typography, Button, CircularProgress, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";

// const BookDetailReport = ({ bookId, onBack }) => {
//   const [rows, setRows] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const apiRequests = new APIrequests();

//   useEffect(() => {
//     const fetchDetails = async () => {
//       setLoading(true);
//       try {
//         // נתיב דוח מפורט לספר
//         const url = `/workEntries/reports/project/${bookId}?month=&year=`; // אפשר להוסיף פילטר חודשי אם רוצים
//         const data = await apiRequests.getRequest(url);
//         setRows(data);
//       } catch {
//         setRows([]);
//       }
//       setLoading(false);
//     };
//     fetchDetails();
//   }, [bookId]);

//   return (
//     <Box mt={2}>
//       <Button variant="text" onClick={onBack}>⬅ חזור</Button>
//       <Typography variant="h6">פירוט עבודה על ספר</Typography>
//       {loading && <CircularProgress />}
//       {!loading && (
//         <Table>
//           <TableHead>
//             <TableRow>
//               <TableCell>שם עורך</TableCell>
//               <TableCell>תאריך</TableCell>
//               <TableCell>כמות</TableCell>
//               <TableCell>תיאור</TableCell>
//               <TableCell>הערות</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {rows.map((row, idx) => (
//               <TableRow key={idx}>
//                 <TableCell>{row.editor_name}</TableCell>
//                 <TableCell>{row.date?.split('T')[0]}</TableCell>
//                 <TableCell>{row.quantity}</TableCell>
//                 <TableCell>{row.description}</TableCell>
//                 <TableCell>{row.notes}</TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       )}
//     </Box>
//   );
// };

// export default BookDetailReport;
