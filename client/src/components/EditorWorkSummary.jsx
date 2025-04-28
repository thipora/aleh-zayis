// import React, { useState, useEffect } from "react";
// import {
//   Box, Typography, Table, TableBody, TableCell, TableHead, TableRow,
//   Button, Paper, Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress
// } from "@mui/material";
// import { APIrequests } from "../APIrequests";

// // דיאלוג שמציג את כל העבודות לספר אחד
// const BookWorkDetailDialog = ({ open, book, works, onClose }) => (
//   <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
//     <DialogTitle>פירוט עבור: {book.book_name} ({book.book_id})</DialogTitle>
//     <DialogContent>
//       <Table>
//         <TableHead>
//           <TableRow>
//             <TableCell>תאריך</TableCell>
//             <TableCell>כמות</TableCell>
//             <TableCell>תיאור</TableCell>
//             <TableCell>הערות</TableCell>
//           </TableRow>
//         </TableHead>
//         <TableBody>
//           {works.map((w, i) => (
//             <TableRow key={i}>
//               <TableCell>{w.date?.split("T")[0]}</TableCell>
//               <TableCell>{w.quantity}</TableCell>
//               <TableCell>{w.description}</TableCell>
//               <TableCell>{w.notes}</TableCell>
//             </TableRow>
//           ))}
//         </TableBody>
//       </Table>
//     </DialogContent>
//     <DialogActions>
//       <Button onClick={onClose}>סגור</Button>
//     </DialogActions>
//   </Dialog>
// );

// const EditorWorkSummary = ({ editor, month, year, onBack }) => {
//   const [books, setBooks] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedBook, setSelectedBook] = useState(null);

//   const apiRequests = new APIrequests();

//   useEffect(() => {
//     const fetchBooks = async () => {
//       setLoading(true);
//       try {
//         const url = `/workEntries/reports/editor/${editor.editor_id}?month=${month}&year=${year}`;
//         const data = await apiRequests.getRequest(url);
//         setBooks(data);
//       } catch {
//         setBooks([]);
//       }
//       setLoading(false);
//     };
//     fetchBooks();
//   }, [editor, month, year]);

//   // קיבוץ וסיכום לפי ספר
//   const booksSummary = Object.values(
//     books.reduce((acc, curr) => {
//       if (!acc[curr.book_id]) {
//         acc[curr.book_id] = {
//           book_id: curr.book_id,
//           book_name: curr.book_name,
//           total_hours: 0,
//           works: []
//         };
//       }
//       acc[curr.book_id].total_hours += Number(curr.quantity || curr.total_hours || 0);
//       acc[curr.book_id].works.push(curr);
//       return acc;
//     }, {})
//   );

//   return (
//     <Box mt={3} maxWidth={800} mx="auto">
//       <Paper elevation={2} sx={{ p: 2 }}>
//         <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
//           <Typography variant="h6">פירוט שעות לעורך: {editor.editor_name}</Typography>
//           <Button onClick={onBack}>⬅ חזור לכל העורכים</Button>
//         </Box>
//         {loading && <CircularProgress />}
//         {!loading && (
//           <Table>
//             <TableHead>
//               <TableRow>
//                 <TableCell>שם ספר</TableCell>
//                 <TableCell>מס' ספר</TableCell>
//                 <TableCell align="center">סה"כ שעות</TableCell>
//                 <TableCell align="center">פירוט</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {booksSummary.map((book) => (
//                 <TableRow key={book.book_id}>
//                   <TableCell>{book.book_name}</TableCell>
//                   <TableCell>{book.book_id}</TableCell>
//                   <TableCell align="center">{book.total_hours}</TableCell>
//                   <TableCell align="center">
//                     <Button
//                       variant="outlined"
//                       size="small"
//                       onClick={() => setSelectedBook(book)}
//                     >
//                       הצג פירוט
//                     </Button>
//                   </TableCell>
//                 </TableRow>
//               ))}
//               {/* שורת סיכום */}
//               <TableRow>
//                 <TableCell colSpan={2} align="center" sx={{ fontWeight: "bold" }}>סה"כ שעות</TableCell>
//                 <TableCell align="center" sx={{ fontWeight: "bold" }}>
//                   {booksSummary.reduce((sum, b) => sum + Number(b.total_hours), 0)}
//                 </TableCell>
//                 <TableCell />
//               </TableRow>
//             </TableBody>
//           </Table>
//         )}

//         {/* דיאלוג פירוט לספר */}
//         {selectedBook && (
//           <BookWorkDetailDialog
//             open={!!selectedBook}
//             book={selectedBook}
//             works={selectedBook.works}
//             onClose={() => setSelectedBook(null)}
//           />
//         )}
//       </Paper>
//     </Box>
//   );
// };

// export default EditorWorkSummary;

import React, { useState, useEffect } from "react";
import {
  Box, Typography, Table, TableBody, TableCell, TableHead, TableRow,
  Button, Paper, Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress
} from "@mui/material";
import { APIrequests } from "../APIrequests";

// פונקציה להמרת שעות עשרוניות למחרוזת "X שעות ו-Y דקות"
function hoursToString(hours) {
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  if (h && m) return `${h} שעות ו-${m} דקות`;
  if (h) return `${h} שעות`;
  return `${m} דקות`;
}

// דיאלוג שמציג את כל העבודות לספר אחד
const BookWorkDetailDialog = ({ open, book, works, onClose }) => (
  <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
    <DialogTitle>
      פירוט עבור: {book.book_name} - {book.book_id}
    </DialogTitle>
    <DialogContent>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>תאריך</TableCell>
            <TableCell>כמות</TableCell>
            <TableCell>תיאור</TableCell>
            <TableCell>הערות</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {works.map((w, i) => (
            <TableRow key={i}>
              <TableCell>{w.date?.split("T")[0]}</TableCell>
              <TableCell>{hoursToString(Number(w.quantity))}</TableCell>
              <TableCell>{w.description}</TableCell>
              <TableCell>{w.notes}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose}>סגור</Button>
    </DialogActions>
  </Dialog>
);

const EditorWorkSummary = ({ editor, month, year, onBack }) => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBook, setSelectedBook] = useState(null);

  const apiRequests = new APIrequests();

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      try {
        const url = `/workEntries/reports/editor/${editor.editor_id}?month=${month}&year=${year}`;
        const data = await apiRequests.getRequest(url);
        setBooks(data);
      } catch {
        setBooks([]);
      }
      setLoading(false);
    };
    fetchBooks();
  }, [editor, month, year]);

  // קיבוץ וסיכום לפי ספר
  const booksSummary = Object.values(
    books.reduce((acc, curr) => {
      if (!acc[curr.book_id]) {
        acc[curr.book_id] = {
          book_id: curr.book_id,
          book_name: curr.book_name,
          total_hours: 0,
          works: []
        };
      }
      acc[curr.book_id].total_hours += Number(curr.quantity || curr.total_hours || 0);
      acc[curr.book_id].works.push(curr);
      return acc;
    }, {})
  );

  return (
    <Box mt={3} maxWidth={800} mx="auto">
      <Paper elevation={2} sx={{ p: 2 }}>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <Typography variant="h6">פירוט שעות לעורך: {editor.editor_name}</Typography>
          <Button onClick={onBack}>⬅ חזור לכל העורכים</Button>
        </Box>
        {loading && <CircularProgress />}
        {!loading && (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ספר</TableCell>
                <TableCell align="center">סה"כ שעות</TableCell>
                <TableCell align="center">פירוט</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {booksSummary.map((book) => (
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
              {/* שורת סיכום */}
              <TableRow>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>סה"כ שעות</TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  {hoursToString(booksSummary.reduce((sum, b) => sum + Number(b.total_hours), 0))}
                </TableCell>
                <TableCell />
              </TableRow>
            </TableBody>
          </Table>
        )}

        {/* דיאלוג פירוט לספר */}
        {selectedBook && (
          <BookWorkDetailDialog
            open={!!selectedBook}
            book={selectedBook}
            works={selectedBook.works}
            onClose={() => setSelectedBook(null)}
          />
        )}
      </Paper>
    </Box>
  );
};

export default EditorWorkSummary;
