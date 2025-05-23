// import React, { useEffect, useState } from "react";
// import { Box, Typography, Button, CircularProgress } from "@mui/material";
// import { APIrequests } from "../../APIrequests";
// import AddBookDialog from "./AddBookDialog.jsx";
// import CustomRate from "./CustomRate";

// const AssignedBooksList = ({ employeeId, initialBooks = [] }) => {
//   const [books, setBooks] = useState(initialBooks);
//   const [loading, setLoading] = useState(initialBooks.length === 0);
//   const [editDialogOpen, setEditDialogOpen] = useState(false);
//   const [bookToEdit, setBookToEdit] = useState(null);
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

//   const handleEditClick = (book) => {
//     setBookToEdit(book);
//     setEditDialogOpen(true);
//   };

//   const handleSaveRate = async (data) => {
//     try {
//       await api.putRequest(`/book-assignments/custom-rate`, data);
//       setBooks(prev => prev.map(b =>
//         b.id_book_assignment === data.id_book_assignment
//           ? { ...b, custom_rate: data.custom_rate, rate_type: data.rate_type }
//           : b
//       ));
//     } catch (err) {
//       alert("שגיאה בשמירת תשלום מותאם");
//     } finally {
//       setEditDialogOpen(false);
//       setBookToEdit(null);
//     }
//   };


//   const handleDelete = async (book) => {
//     const confirmed = window.confirm(`האם את/ה בטוח/ה שברצונך לסיים עבודה על הספר "${book.title}"?`);
//     if (!confirmed) return;

//     try {
//       const bookId = book.id_book;
//       await api.postRequest(`/book-assignments/complete`, { bookId, employeeId });
//       setBooks(prev => prev.filter(b => b.id_book !== bookId));
//     } catch (err) {
//       console.error("שגיאה במחיקת הספר", err);
//       alert("אירעה שגיאה במחיקה.");
//     }
//   };

//   if (loading) return <CircularProgress />;

//   return (
//     <Box>
//       {books.length === 0 ? (
//         <Typography>כרגע אין ספרים שאתה עובד עליהם</Typography>
//       ) : (
//         books.map((book) => (
//           <Box
//             key={book.id_book}
//             display="flex"
//             justifyContent="space-between"
//             alignItems="center"
//             mb={1}
//             borderBottom="1px solid #ddd"
//             pb={1}
//           >
//             <Box>
//               <Typography variant="subtitle1">{book.title}</Typography>
//               <Typography variant="body2" color="textSecondary">
//                 תפקיד: {book.role_name}
//               </Typography>
//             </Box>

//             <Button
//               variant="outlined"
//               color="primary"
//               size="small"
//               onClick={() => handleEditClick(book)}
//             >
//               ערוך תשלום
//             </Button>

//             <Button
//               variant="outlined"
//               color="error"
//               size="small"
//               onClick={() => handleDelete(book)}
//             >
//               סיים עבודה
//             </Button>
//           </Box>
//         ))
//       )}
//       <CustomRate
//         open={editDialogOpen}
//         book={bookToEdit}
//         onClose={() => setEditDialogOpen(false)}
//         onSave={handleSaveRate}
//       />

//       <AddBookDialog
//         employeeId={employeeId}
//         onSuccess={(newBook) => setBooks(prev => [...prev, newBook])}
//       />
//     </Box>
//   );
// };

// export default AssignedBooksList;
import React, { useEffect, useState } from "react";
import { Box, Typography, Button, CircularProgress } from "@mui/material";
import { APIrequests } from "../../APIrequests";
import AddBookDialog from "./AddBookDialog.jsx";
import CustomRate from "./CustomRate";

const AssignedBooksList = ({ employeeId, initialBooks = [] }) => {
  const [books, setBooks] = useState(initialBooks);
  const [loading, setLoading] = useState(initialBooks.length === 0);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [bookToEdit, setBookToEdit] = useState(null);
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

  const handleEditClick = (book) => {
    setBookToEdit(book);
    setEditDialogOpen(true);
  };

  const handleSaveRate = async (data) => {
    try {
      await api.putRequest(`/book-assignments/custom-rate`, data);
      setBooks(prev =>
        prev.map(b =>
          b.id_book_assignment === data.id_book_assignment
            ? { ...b, custom_rate: data.custom_rate, rate_type: data.rate_type }
            : b
        )
      );
    } catch (err) {
      alert("שגיאה בשמירת תשלום מותאם");
    } finally {
      setEditDialogOpen(false);
      setBookToEdit(null);
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

              {book.custom_rate ? (
                <Typography variant="body2" color="primary">
                  תשלום מותאם: {book.custom_rate}
                </Typography>
              ) : (
                <Typography variant="body2" color="textSecondary">
                  אין תשלום מותאם
                </Typography>
              )}
            </Box>

            <Box display="flex" gap={1}>
              <Button
                variant="outlined"
                color={book.custom_rate ? "primary" : "success"}
                size="small"
                onClick={() => handleEditClick(book)}
              >
                {book.custom_rate ? "ערוך תשלום" : "הוסף תשלום מותאם"}
              </Button>

              <Button
                variant="outlined"
                color="error"
                size="small"
                onClick={() => handleDelete(book)}
              >
                סיים עבודה
              </Button>
            </Box>
          </Box>
        ))
      )}

      <AddBookDialog
        employeeId={employeeId}
        onSuccess={(newBook) => setBooks(prev => [...prev, newBook])}
      />

      <CustomRate
        open={editDialogOpen}
        book={bookToEdit}
        onClose={() => setEditDialogOpen(false)}
        onSave={handleSaveRate}
      />
    </Box>
  );
};

export default AssignedBooksList;
