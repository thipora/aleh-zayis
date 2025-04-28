// import React, { useState, useEffect } from "react";
// import { APIrequests } from "../APIrequests";
// import { Box, Typography, CircularProgress, Table, TableBody, TableCell, TableHead, TableRow, Button } from "@mui/material";

// const BooksSummaryTable = ({ onSelect }) => {
//   const [books, setBooks] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [year, setYear] = useState(new Date().getFullYear());
//   const [month, setMonth] = useState(new Date().getMonth() + 1);

//   const apiRequests = new APIrequests();

//   useEffect(() => {
//     const fetchBooks = async () => {
//       setLoading(true);
//       setError("");
//       try {
//         const url = `/books/summary?month=${month}&year=${year}`; // יש להתאים לשרת, או להשתמש בדוח הקיים עם התאמה קלה
//         const data = await apiRequests.getRequest(url);
//         setBooks(data);
//       } catch {
//         setError("שגיאה בטעינת סיכום ספרים");
//       }
//       setLoading(false);
//     };
//     fetchBooks();
//   }, [month, year]);

//   return (
//     <Box>
//       <Typography variant="h6" mb={1}>סיכום שעות לפי ספרים</Typography>
//       <Box mb={1}>
//         <label>
//           שנה:{" "}
//           <input type="number" value={year} onChange={e => setYear(e.target.value)} style={{ width: 70 }} />
//         </label>
//         {" "}
//         <label>
//           חודש:{" "}
//           <input type="number" min={1} max={12} value={month} onChange={e => setMonth(e.target.value)} style={{ width: 40 }} />
//         </label>
//       </Box>
//       {loading && <CircularProgress />}
//       {error && <Typography color="error">{error}</Typography>}
//       {!loading && !error && (
//         <Table>
//           <TableHead>
//             <TableRow>
//               <TableCell>שם ספר</TableCell>
//               <TableCell>סה"כ שעות</TableCell>
//               <TableCell>פעולה</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {books.map((row, idx) => (
//               <TableRow key={idx}>
//                 <TableCell>{row.book_name}</TableCell>
//                 <TableCell>{row.total_hours}</TableCell>
//                 <TableCell>
//                   <Button variant="outlined" size="small" onClick={() => onSelect(row.book_id)}>
//                     פירוט
//                   </Button>
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       )}
//     </Box>
//   );
// };

// export default BooksSummaryTable;

import React, { useState, useEffect } from "react";
import {
  Box, Typography, Table, TableBody, TableCell, TableHead, TableRow,
  Button, IconButton, CircularProgress, Paper
} from "@mui/material";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { APIrequests } from "../APIrequests";
import BookEmployeesDialog from "./BookEmployeesDialog";

function hoursToString(hours) {
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  if (h && m) return `${h} שעות ו-${m} דקות`;
  if (h) return `${h} שעות`;
  return `${m} דקות`;
}

const monthNames = [
  "ינואר", "פברואר", "מרץ", "אפריל", "מאי", "יוני",
  "יולי", "אוגוסט", "ספטמבר", "אוקטובר", "נובמבר", "דצמבר"
];

const BooksSummaryTable = () => {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [allTime, setAllTime] = useState(false);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedBook, setSelectedBook] = useState(null);

  const apiRequests = new APIrequests();

  useEffect(() => {
    fetchBooks();
    // eslint-disable-next-line
  }, [month, year, allTime]);

  const fetchBooks = async () => {
    setLoading(true);
    setError("");
    setBooks([]);
    try {
      let url = `/workEntries/reports/books-summary`;
      if (!allTime) url += `?month=${month}&year=${year}`;
      const data = await apiRequests.getRequest(url);
      setBooks(data);
    } catch {
      setError("שגיאה בטעינת דוח ספרים");
    }
    setLoading(false);
  };

  const handlePrevMonth = () => {
    setAllTime(false);
    if (month === 1) {
      setMonth(12);
      setYear(year - 1);
    } else {
      setMonth(month - 1);
    }
  };

  const handleNextMonth = () => {
    setAllTime(false);
    if (month === 12) {
      setMonth(1);
      setYear(year + 1);
    } else {
      setMonth(month + 1);
    }
  };

  return (
    <Box mt={3} maxWidth={900} mx="auto">
      <Paper elevation={2} sx={{ p: 2 }}>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <Typography variant="h6">
            דוח שעות עבודה לכל הספרים {allTime ? "(כל התקופה)" : `– ${monthNames[month - 1]} ${year}`}
          </Typography>
          <Box>
            <IconButton onClick={handlePrevMonth} disabled={allTime}><ArrowBackIosNewIcon /></IconButton>
            <IconButton onClick={handleNextMonth} disabled={allTime}><ArrowForwardIosIcon /></IconButton>
            <Button variant={allTime ? "contained" : "outlined"} onClick={() => setAllTime(!allTime)}>
              {allTime ? "סנן לפי חודש" : "הצג כל הזמנים"}
            </Button>
          </Box>
        </Box>
        {loading && <CircularProgress />}
        {error && <Typography color="error">{error}</Typography>}
        {!loading && !error && (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>שם ספר</TableCell>
                <TableCell align="center">סה"כ שעות</TableCell>
                <TableCell align="center">פירוט</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {books.map((book) => (
                <TableRow key={book.book_id}>
                  <TableCell>{book.book_name} - {book.book_id}</TableCell>
                  <TableCell align="center">{hoursToString(book.total_hours)}</TableCell>
                  <TableCell align="center">
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => setSelectedBook(book)}
                    >
                      הצג פירוט
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>סה"כ שעות לכל הספרים</TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  {hoursToString(books.reduce((sum, b) => sum + Number(b.total_hours), 0))}
                </TableCell>
                <TableCell />
              </TableRow>
            </TableBody>
          </Table>
        )}
        {!loading && !error && books.length === 0 && (
          <Typography color="textSecondary" align="center" mt={2}>
            אין נתונים להצגה לתקופה זו
          </Typography>
        )}

        {/* דיאלוג עובדים לספר */}
        <BookEmployeesDialog
          open={!!selectedBook}
          book={selectedBook}
          month={month}
          year={year}
          allTime={allTime}
          onClose={() => setSelectedBook(null)}
        />
      </Paper>
    </Box>
  );
};

export default BooksSummaryTable;
