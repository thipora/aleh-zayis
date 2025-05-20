
// import React, { useEffect, useState } from "react";
// import { Box, Typography, Button, CircularProgress } from "@mui/material";
// import { APIrequests } from "../../APIrequests";
// import AddBookDialog from "./AddBookDialog.jsx"

// const AssignedBooksList = ({ employeeId, initialBooks = [] }) => {
//   const [books, setBooks] = useState(initialBooks);
//   const [loading, setLoading] = useState(initialBooks.length === 0);
//   const [bookToDelete, setBookToDelete] = useState(null);
//   const api = new APIrequests();

//   useEffect(() => {
//     if (initialBooks.length === 0) fetchAssignedBooks();
//     else setLoading(false);
//   }, []);

//   const fetchAssignedBooks = async () => {
//     try {
//       const data = await api.getRequest(`/book-assignments/by-employee/${employeeId}`);
//       setBooks(data);
//     } catch (error) {
//       console.error("Failed to fetch assigned books", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleConfirmDelete = (book) => {
//   setBookToDelete(book);
// };



//   const markAsCompleted = async (bookId) => {
//     try {
//       await api.postRequest(`/book-assignments/complete`, { bookId, employeeId });
//       setBooks(prev => prev.map(b => b.id_book === bookId ? { ...b, is_completed: 1 } : b));
//     } catch (error) {
//       console.error("Failed to mark book as completed", error);
//     }
//   };

//   if (loading) return <CircularProgress />;

//   return (
//     <Box>



//       {books.length === 0 ? (
//         <Typography>כרגע אין ספרים שאתה עובד עליהם</Typography>
//       ) : (
//         books.map((book) => (
//           <Box key={book.id_book} display="flex" justifyContent="space-between" alignItems="center" mb={1} borderBottom="1px solid #ddd" pb={1}>
//             <Box>
//               <Typography variant="subtitle1">{book.title}</Typography>
//               <Typography variant="body2" color="textSecondary">תפקיד: {book.role_name}</Typography>
//             </Box>
//             {/* <Button
//               variant="outlined"
//               color={book.is_completed ? "success" : "primary"}
//               onClick={() => markAsCompleted(book.id_book)}
//               disabled={book.is_completed}
//             >
//               {book.is_completed ? "✔ סומן" : "סמן כסיום"}
//             </Button> */}
//             <Button
//   variant="outlined"
//   color="error"
//   size="small"
//   onClick={() => handleConfirmDelete(book)}
// >
//   סיים עבודה
// </Button>

//           </Box>
//         ))
//       )}


// <AddBookDialog
//   employeeId={employeeId}
//   onSuccess={(newBook) => setBooks(prev => [...prev, newBook])}
//   // onAddBook={(newBook) => setBooks(prev => [...prev, newBook])}
// />


// <Dialog open={!!bookToDelete} onClose={() => setBookToDelete(null)}>
//   <DialogTitle>אישור סיום עבודה</DialogTitle>
//   <DialogContent>
//     האם את/ה בטוח/ה שברצונך לסיים עבודה על הספר "{bookToDelete?.title}"?
//   </DialogContent>
//   <DialogActions>
//     <Button onClick={() => setBookToDelete(null)} color="primary">
//       ביטול
//     </Button>
//     <Button onClick={async () => {
//       try {
//         await api.deleteRequest(`/book-assignments/${bookToDelete.id_book}`);
//         setBooks(prev => prev.filter(b => b.id_book !== bookToDelete.id_book));
//       } catch (err) {
//         console.error("שגיאה במחיקה", err);
//         alert("אירעה שגיאה במחיקה.");
//       } finally {
//         setBookToDelete(null);
//       }
//     }} color="error">
//       אישור
//     </Button>
//   </DialogActions>
// </Dialog>


//     </Box>

    
    
//   );
// };

// export default AssignedBooksList;

import React, { useEffect, useState } from "react";
import { Box, Typography, Button, CircularProgress } from "@mui/material";
import { APIrequests } from "../../APIrequests";
import AddBookDialog from "./AddBookDialog.jsx";

const AssignedBooksList = ({ employeeId, initialBooks = [] }) => {
  const [books, setBooks] = useState(initialBooks);
  const [loading, setLoading] = useState(initialBooks.length === 0);
  const api = new APIrequests();

  useEffect(() => {
    if (initialBooks.length === 0) fetchAssignedBooks();
    else setLoading(false);
  }, []);

  const fetchAssignedBooks = async () => {
    try {
      const data = await api.getRequest(`/book-assignments/by-employee/${employeeId}`);
      setBooks(data);
    } catch (error) {
      console.error("Failed to fetch assigned books", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (book) => {
    const confirmed = window.confirm(`האם את/ה בטוח/ה שברצונך לסיים עבודה על הספר "${book.title}"?`);
    if (!confirmed) return;

    try {
      const bookId = book.id_book;
      await api.postRequest(`/book-assignments/complete`, { bookId, employeeId });
      setBooks(prev => prev.filter(b => b.id_book !== bookId));
    } catch (err) {
      console.error("שגיאה במחיקת הספר", err);
      alert("אירעה שגיאה במחיקה.");
    }
  };

  if (loading) return <CircularProgress />;

  return (
    <Box>
      {books.length === 0 ? (
        <Typography>כרגע אין ספרים שאתה עובד עליהם</Typography>
      ) : (
        books.map((book) => (
          <Box
            key={book.id_book}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={1}
            borderBottom="1px solid #ddd"
            pb={1}
          >
            <Box>
              <Typography variant="subtitle1">{book.title}</Typography>
              <Typography variant="body2" color="textSecondary">
                תפקיד: {book.role_name}
              </Typography>
            </Box>
            <Button
              variant="outlined"
              color="error"
              size="small"
              onClick={() => handleDelete(book)}
            >
              סיים עבודה
            </Button>
          </Box>
        ))
      )}

      <AddBookDialog
        employeeId={employeeId}
        onSuccess={(newBook) => setBooks(prev => [...prev, newBook])}
      />
    </Box>
  );
};

export default AssignedBooksList;
