
import React, { useEffect, useState } from "react";
import { Box, Typography, Button, CircularProgress } from "@mui/material";
import { APIrequests } from "../../APIrequests";
import AddBookDialog from "./AddBookDialog.jsx"

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

  const markAsCompleted = async (bookId) => {
    try {
      await api.postRequest(`/book-assignments/complete`, { bookId, employeeId });
      setBooks(prev => prev.map(b => b.id_book === bookId ? { ...b, is_completed: 1 } : b));
    } catch (error) {
      console.error("Failed to mark book as completed", error);
    }
  };

  if (loading) return <CircularProgress />;

  return (
    <Box>



      {books.length === 0 ? (
        <Typography>כרגע אין ספרים שאתה עובד עליהם</Typography>
      ) : (
        books.map((book) => (
          <Box key={book.id_book} display="flex" justifyContent="space-between" alignItems="center" mb={1} borderBottom="1px solid #ddd" pb={1}>
            <Box>
              <Typography variant="subtitle1">{book.title}</Typography>
              <Typography variant="body2" color="textSecondary">תפקיד: {book.role_name}</Typography>
            </Box>
            <Button
              variant="outlined"
              color={book.is_completed ? "success" : "primary"}
              onClick={() => markAsCompleted(book.id_book)}
              disabled={book.is_completed}
            >
              {book.is_completed ? "✔ סומן" : "סמן כסיום"}
            </Button>
          </Box>
        ))
      )}


<AddBookDialog
  employeeId={employeeId}
  onSuccess={fetchAssignedBooks}
/>

    </Box>
    
  );
};

export default AssignedBooksList;