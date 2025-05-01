// import React, { useEffect, useState } from "react";
// import {
//   Box, Typography, Paper, CircularProgress, Table,
//   TableBody, TableCell, TableHead, TableRow, FormControl,
//   InputLabel, Select, MenuItem
// } from "@mui/material";
// import { APIrequests } from "../../APIrequests";

// const BookPivotReport = () => {
//   const [books, setBooks] = useState([]);
//   const [selectedBookId, setSelectedBookId] = useState("");
//   const [report, setReport] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const api = new APIrequests();

//   useEffect(() => {
//     const fetchBooks = async () => {
//       try {
//         const data = await api.getRequest("/books");
//         setBooks(data);
//       } catch (err) {
//         console.error("Failed to load books", err);
//       }
//     };
//     fetchBooks();
//   }, []);

//   useEffect(() => {
//     const fetchReport = async () => {
//       if (!selectedBookId) return;
//       setLoading(true);
//       try {
//         const data = await api.getRequest(`/reports/books/${selectedBookId}/pivot-summary`);
//         setReport(data);
//       } catch (err) {
//         console.error("Failed to load report", err);
//       }
//       setLoading(false);
//     };
//     fetchReport();
//   }, [selectedBookId]);

//   // בניית שמות עמודות מתוך כל סוגי התפקידים שמופיעים בנתונים
//   const allRoles = Array.from(new Set(report.flatMap(r => Object.keys(r.roles || {}))));

//   return (
//     <Box mt={4} maxWidth={1100} mx="auto">
//       <Paper sx={{ p: 3 }}>
//         <Typography variant="h5" gutterBottom>
//           דוח תשלום לפי תפקידים לעובדים עבור ספר
//         </Typography>

//         <FormControl fullWidth sx={{ mb: 3 }}>
//           <InputLabel>בחר ספר</InputLabel>
//           <Select
//             value={selectedBookId}
//             onChange={(e) => setSelectedBookId(e.target.value)}
//           >
//             {books.map(book => (
//               <MenuItem key={book.id_book} value={book.id_book}>
//                 {book.title} - {book.id_book}
//               </MenuItem>
//             ))}
//           </Select>
//         </FormControl>

//         {loading ? (
//           <CircularProgress />
//         ) : (
//           <Table>
//             <TableHead>
//               <TableRow>
//                 <TableCell>שם עובד</TableCell>
//                 {allRoles.map(role => (
//                   <TableCell key={role} align="center">{role}</TableCell>
//                 ))}
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {report.map((row, i) => (
//                 <TableRow key={i}>
//                   <TableCell>{row.employee_name}</TableCell>
//                   {allRoles.map(role => (
//                     <TableCell key={role} align="center">
//                       {row.roles?.[role]?.toFixed(2) || ""}
//                     </TableCell>
//                   ))}
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         )}
//       </Paper>
//     </Box>
//   );
// };

// export default BookPivotReport;


import React, { useEffect, useState } from "react";
import {
  Box, Typography, Paper, CircularProgress, Table,
  TableBody, TableCell, TableHead, TableRow, TextField, Button
} from "@mui/material";
import { APIrequests } from "../../APIrequests";

const BookPivotReport = () => {
  const [bookIdInput, setBookIdInput] = useState("");
  const [selectedBookId, setSelectedBookId] = useState("");
  const [report, setReport] = useState([]);
  const [loading, setLoading] = useState(false);

  const api = new APIrequests();

  useEffect(() => {
    const fetchReport = async () => {
      if (!selectedBookId) return;
      setLoading(true);
      try {
        const data = await api.getRequest(`/reports/book-summary/${selectedBookId}`);
        setReport(data);
      } catch (err) {
        console.error("Failed to load report", err);
      }
      setLoading(false);
    };
    fetchReport();
  }, [selectedBookId]);

  const handleSubmit = () => {
    if (bookIdInput.trim()) {
      setSelectedBookId(bookIdInput.trim());
    }
  };

  // בניית כל סוגי התפקידים מהתוצאה
  const allRoles = Array.from(new Set(report.flatMap(r => Object.keys(r.roles || {}))));

  return (
    <Box mt={4} maxWidth={1100} mx="auto">
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          דוח תשלום לפי תפקידים לעובדים עבור ספר
        </Typography>

        <Box display="flex" gap={2} mb={3}>
          <TextField
            label="Book ID"
            value={bookIdInput}
            onChange={(e) => setBookIdInput(e.target.value)}
            fullWidth
          />
          <Button variant="contained" onClick={handleSubmit}>
            הצג דוח
          </Button>
        </Box>

        {loading ? (
          <CircularProgress />
        ) : (
          selectedBookId && report.length > 0 && (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>שם עובד</TableCell>
                  {allRoles.map(role => (
                    <TableCell key={role} align="center">{role}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {report.map((row, i) => (
                  <TableRow key={i}>
                    <TableCell>{row.employee_name}</TableCell>
                    {allRoles.map(role => (
                      <TableCell key={role} align="center">
                        {row.roles?.[role]?.toFixed(2) || ""}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )
        )}
      </Paper>
    </Box>
  );
};

export default BookPivotReport;
