// import React, { useState, useEffect } from "react";
// import {
//   Box, Typography, Select, MenuItem, FormControl, InputLabel, Paper, CircularProgress
// } from "@mui/material";
// import { APIrequests } from "../../APIrequests";
// import BookSummaryReport from "./BookSummaryReport";

// const BookSummaryPage = () => {
//   const [books, setBooks] = useState([]);
//   const [selectedBook, setSelectedBook] = useState(null);
//   const [loading, setLoading] = useState(true);

//   const api = new APIrequests();

//   useEffect(() => {
//     const fetchBooks = async () => {
//       setLoading(true);
//       try {
//         const data = await api.getRequest("/books"); // מביא את כל הספרים
//         setBooks(data);
//       } catch (err) {
//         console.error("Error loading books:", err);
//       }
//       setLoading(false);
//     };
//     fetchBooks();
//   }, []);

//   const handleSelect = (event) => {
//     const book = books.find(b => b.id_book === event.target.value);
//     setSelectedBook(book);
//   };

//   const handleBack = () => setSelectedBook(null);

//   return (
//     <Box mt={4} maxWidth={900} mx="auto">
//       {!selectedBook ? (
//         <Paper sx={{ p: 3 }}>
//           <Typography variant="h5" gutterBottom>
//             בחר ספר לצפייה בסיכום עבודה
//           </Typography>
//           {loading ? (
//             <CircularProgress />
//           ) : (
//             <FormControl fullWidth>
//               <InputLabel>בחר ספר</InputLabel>
//               <Select
//                 value={selectedBook?.id_book || ""}
//                 onChange={handleSelect}
//               >
//                 {books.map((book) => (
//                   <MenuItem key={book.id_book} value={book.id_book}>
//                     {book.title} - {book.id_book}
//                   </MenuItem>
//                 ))}
//               </Select>
//             </FormControl>
//           )}
//         </Paper>
//       ) : (
//         <BookSummaryReport
//           bookId={selectedBook.id_book}
//           bookName={selectedBook.title}
//           onBack={handleBack}
//         />
//       )}
//     </Box>
//   );
// };

// export default BookSummaryPage;
