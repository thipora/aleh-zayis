// import React, { useEffect, useState } from "react";
// import { Box, Dialog, Typography, Button, CircularProgress } from "@mui/material";
// import { APIrequests } from "../../APIrequests";

// const AssignedBooksList = ({ employeeId, initialBooks = [] }) => {
//   const [books, setBooks] = useState(initialBooks);
//   const [loading, setLoading] = useState(initialBooks.length === 0);

//   const api = new APIrequests();

//   useEffect(() => {
//     if (initialBooks.length === 0) {
//       fetchAssignedBooks();
//     } else {
//       setLoading(false);
//     }
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

//   const markAsCompleted = async (bookId) => {
//     try {
//       await api.postRequest(`/book-assignments/complete`, {
//         bookId,
//         employeeId
//       });
//       setBooks(prev =>
//         prev.map(b =>
//           b.id_book === bookId ? { ...b, is_completed: 1 } : b
//         )
//       );
//     } catch (error) {
//       console.error("Failed to mark book as completed", error);
//     }
//   };

//   if (loading) return <CircularProgress />;

// return (
//   // <Box>
//   //   {books.length === 0 ? (
//   //     <Typography>כרגע אין ספרים שאני עובד עליהם</Typography>
//   //   ) : (
//   //     books.map((book) => (
//   //       <Box key={book.id_book} display="flex" justifyContent="space-between" alignItems="center" mb={1} borderBottom="1px solid #ddd" pb={1}>
//   //         <Box>
//   //           <Typography variant="subtitle1">{book.title}</Typography>
//   //           <Typography variant="body2" color="textSecondary">תפקיד: {book.role_name}</Typography>
//   //         </Box>
//   //         <Button
//   //           variant="outlined"
//   //           color={book.is_completed ? "success" : "primary"}
//   //           onClick={() => markAsCompleted(book.id_book)}
//   //           disabled={book.is_completed}
//   //         >
//   //           {book.is_completed ? "✔ סומן" : "סמן כסיום"}
//   //         </Button>
//   //       </Box>
//   //     ))
//   //   )}
//   // </Box>
//   <Dialog open={openAssignedBooksDialog} onClose={() => setOpenAssignedBooksDialog(false)} maxWidth="sm" fullWidth>
//   <DialogTitle>הספרים שאתה עובד עליהם</DialogTitle>
//   <DialogContent>
//     <AssignedBooksList
//       employeeId={employeeId}
//       initialBooks={books}
//       dense
//     />

//     {/* כפתור להוספת ספר */}
//     <Box mt={3}>
//       <Typography variant="h6">הוסף ספר חדש:</Typography>
//       <TextField
//         label="Book ID"
//         value={bookId}
//         onChange={(e) => setBookId(e.target.value)}
//         fullWidth
//         sx={{ mt: 1 }}
//       />
//       {availableRoles.length > 1 && (
//         <>
//           <Typography sx={{ mt: 2 }}>בחר תפקידים:</Typography>
//           {availableRoles.map(role => (
//             <FormControlLabel
//               key={role.id_role}
//               control={
//                 <Checkbox
//                   checked={selectedRoles.includes(role.id_role)}
//                   onChange={(e) => {
//                     if (e.target.checked) {
//                       setSelectedRoles(prev => [...prev, role.id_role]);
//                     } else {
//                       setSelectedRoles(prev => prev.filter(id => id !== role.id_role));
//                     }
//                   }}
//                 />
//               }
//               label={role.role_name}
//             />
//           ))}
//         </>
//       )}

//       <Box mt={2} display="flex" justifyContent="flex-end" gap={1}>
//         <Button onClick={handleAddBook} variant="contained" color="primary">שמור</Button>
//       </Box>
//     </Box>
//   </DialogContent>
//   <DialogActions>
//     <Button onClick={() => setOpenAssignedBooksDialog(false)}>סגור</Button>
//   </DialogActions>
// </Dialog>

// );

// };
// export default AssignedBooksList;


// // // // // AssignedBooksList.jsx
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

// // // import React, { useEffect, useState } from "react";
// // // import {
// // //   Box,
// // //   Typography,
// // //   Button,
// // //   CircularProgress,
// // //   TextField,
// // //   Checkbox,
// // //   FormControlLabel
// // // } from "@mui/material";
// // // import { APIrequests } from "../../APIrequests";

// // // const AssignedBooksList = ({ employeeId, initialBooks = [] }) => {
// // //   const [books, setBooks] = useState(initialBooks);
// // //   const [loading, setLoading] = useState(initialBooks.length === 0);
// // //   const [bookId, setBookId] = useState("");
// // //   const [availableRoles, setAvailableRoles] = useState([]);
// // //   const [selectedRoles, setSelectedRoles] = useState([]);

// // //   const api = new APIrequests();

// // //   useEffect(() => {
// // //     if (initialBooks.length === 0) fetchAssignedBooks();
// // //     else setLoading(false);
// // //     fetchRoles();
// // //   }, []);

// // //   const fetchAssignedBooks = async () => {
// // //     try {
// // //       const data = await api.getRequest(`/book-assignments/by-employee/${employeeId}`);
// // //       setBooks(data);
// // //     } catch (error) {
// // //       console.error("Failed to fetch assigned books", error);
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   const fetchRoles = async () => {
// // //     try {
// // //       const roles = await api.getRequest("/roles");
// // //       setAvailableRoles(roles);
// // //     } catch (error) {
// // //       console.error("Failed to fetch roles", error);
// // //     }
// // //   };

// // //   const markAsCompleted = async (bookId) => {
// // //     try {
// // //       await api.postRequest(`/book-assignments/complete`, { bookId, employeeId });
// // //       setBooks(prev => prev.map(b => b.id_book === bookId ? { ...b, is_completed: 1 } : b));
// // //     } catch (error) {
// // //       console.error("Failed to mark book as completed", error);
// // //     }
// // //   };

// // //   const handleAddBook = async () => {
// // //     try {
// // //       await api.postRequest("/book-assignments/add", {
// // //         AZ_book_id: bookId,
// // //         employeeId,
// // //         selectedRoleIds: selectedRoles
// // //       });
// // //       setBookId("");
// // //       setSelectedRoles([]);
// // //       fetchAssignedBooks(); // רענון הרשימה
// // //     } catch (error) {
// // //       console.error("Failed to assign book", error);
// // //     }
// // //   };

// // //   if (loading) return <CircularProgress />;

// // //   return (
// // //     <Box>
// // //       {/* רשימת הספרים */}
// // //       {books.length === 0 ? (
// // //         <Typography>כרגע אין ספרים שאתה עובד עליהם</Typography>
// // //       ) : (
// // //         books.map((book) => (
// // //           <Box key={book.id_book} display="flex" justifyContent="space-between" alignItems="center" mb={1} borderBottom="1px solid #ddd" pb={1}>
// // //             <Box>
// // //               <Typography variant="subtitle1">{book.title}</Typography>
// // //               <Typography variant="body2" color="textSecondary">תפקיד: {book.role_name}</Typography>
// // //             </Box>
// // //             <Button
// // //               variant="outlined"
// // //               color={book.is_completed ? "success" : "primary"}
// // //               onClick={() => markAsCompleted(book.id_book)}
// // //               disabled={book.is_completed}
// // //             >
// // //               {book.is_completed ? "✔ סומן" : "סמן כסיום"}
// // //             </Button>
// // //           </Box>
// // //         ))
// // //       )}

// // //       {/* טופס הוספת ספר */}
// // //       <Box mt={4}>
// // //         <Typography variant="h6">הוסף ספר חדש</Typography>
// // //         <TextField
// // //           label="Book ID"
// // //           value={bookId}
// // //           onChange={(e) => setBookId(e.target.value)}
// // //           fullWidth
// // //           sx={{ mt: 1 }}
// // //         />
// // //         {availableRoles.length > 1 && (
// // //           <>
// // //             <Typography sx={{ mt: 2 }}>בחר תפקידים:</Typography>
// // //             {availableRoles.map(role => (
// // //               <FormControlLabel
// // //                 key={role.id_role}
// // //                 control={
// // //                   <Checkbox
// // //                     checked={selectedRoles.includes(role.id_role)}
// // //                     onChange={(e) => {
// // //                       if (e.target.checked) {
// // //                         setSelectedRoles(prev => [...prev, role.id_role]);
// // //                       } else {
// // //                         setSelectedRoles(prev => prev.filter(id => id !== role.id_role));
// // //                       }
// // //                     }}
// // //                   />
// // //                 }
// // //                 label={role.role_name}
// // //               />
// // //             ))}
// // //           </>
// // //         )}

// // //         <Box mt={2} display="flex" justifyContent="flex-end">
// // //           <Button onClick={handleAddBook} variant="contained" color="primary">
// // //             שמור
// // //           </Button>
// // //         </Box>
// // //       </Box>
// // //     </Box>
// // //   );
// // // };

// // // export default AssignedBooksList;
// // import React, { useEffect, useState } from "react";
// // import {
// //   Box,
// //   Typography,
// //   Button,
// //   CircularProgress,
// //   TextField,
// //   FormControlLabel,
// //   Checkbox,
// //   Divider
// // } from "@mui/material";
// // import { APIrequests } from "../../APIrequests";

// // const AssignedBooksList = ({ employeeId, initialBooks = [] }) => {
// //   const [books, setBooks] = useState(initialBooks);
// //   const [loading, setLoading] = useState(initialBooks.length === 0);
// //   const [bookId, setBookId] = useState("");
// //   const [availableRoles, setAvailableRoles] = useState([]);
// //   const [selectedRoles, setSelectedRoles] = useState([]);
// //   const api = new APIrequests();

// //   useEffect(() => {
// //     if (initialBooks.length === 0) fetchAssignedBooks();
// //     else setLoading(false);

// //     fetchAvailableRoles();
// //   }, []);

// //   const fetchAssignedBooks = async () => {
// //     try {
// //       const data = await api.getRequest(`/book-assignments/by-employee/${employeeId}`);
// //       setBooks(data);
// //     } catch (error) {
// //       console.error("Failed to fetch assigned books", error);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const fetchAvailableRoles = async () => {
// //     try {
// //       const data = await api.getRequest(`/employee-roles/by-employee/${employeeId}`);
// //       setAvailableRoles(data);
// //     } catch (error) {
// //       console.error("Failed to fetch roles", error);
// //     }
// //   };

// //   // const handleAddBook = async () => {
// //   //   if (!bookId || selectedRoles.length === 0) return;

// //   //   try {
// //   //     await api.postRequest(`/book-assignments/assign`, {
// //   //       AZ_book_id: bookId,
// //   //       employeeId,
// //   //       selectedRoleIds: selectedRoles,
// //   //     });
// //   //     setBookId("");
// //   //     setSelectedRoles([]);
// //   //     fetchAssignedBooks(); // לרענון הרשימה
// //   //   } catch (error) {
// //   //     console.error("Failed to assign book", error);
// //   //   }
// //   // };
// //   const handleAddBook = async () => {
// //   if (!bookId || selectedRoles.length === 0) return;

// //   try {
// //     await api.postRequest(`/book-assignments/assign`, {
// //       AZ_book_id: bookId,
// //       employeeId,
// //       selectedRoleIds: selectedRoles,
// //     });

// //     // הוספה מקומית - נניח שם הספר זה פשוט bookId (אפשר לשפר אם יש מידע נוסף)
// //     const newBooks = selectedRoles.map(roleId => {
// //       const role = availableRoles.find(r => r.id_role === roleId);
// //       return {
// //         id_book: parseInt(bookId),
// //         title: `ספר ${bookId}`, // אפשר להחליף בשם אמיתי אם יש
// //         role_name: role?.role_name || "תפקיד",
// //         is_completed: 0,
// //       };
// //     });

// //     setBooks(prev => [...prev, ...newBooks]);
// //     setBookId("");
// //     setSelectedRoles([]);
// //   } catch (error) {
// //     console.error("Failed to assign book", error);
// //   }
// // };


// //   const markAsCompleted = async (bookId) => {
// //     try {
// //       await api.postRequest(`/book-assignments/complete`, { bookId, employeeId });
// //       setBooks(prev => prev.map(b => b.id_book === bookId ? { ...b, is_completed: 1 } : b));
// //     } catch (error) {
// //       console.error("Failed to mark book as completed", error);
// //     }
// //   };

// //   if (loading) return <CircularProgress />;

// //   return (
// //     <Box>
// //       {/* שורת הוספה */}
// //       <Box mb={2} pb={2} borderBottom="1px solid #ccc" display="flex" alignItems="center" gap={2}>
// //         <Typography variant="h6">הוסף ספר</Typography>

// //         <TextField
// //           label="Book ID"
// //           value={bookId}
// //           onChange={(e) => setBookId(e.target.value)}
// //           size="small"
// //           sx={{ flex: 1 }}
// //         />

// //         <Button
// //           onClick={handleAddBook}
// //           variant="contained"
// //           color="primary"
// //           disabled={!bookId || selectedRoles.length === 0}
// //         >
// //           שמור
// //         </Button>
// //       </Box>

// //       {/* תפקידים זמינים */}
// //       {availableRoles.length > 0 && (
// //         <Box mb={3}>
// //           <Typography variant="body1" gutterBottom>בחר תפקידים:</Typography>
// //           {availableRoles.map(role => (
// //             <FormControlLabel
// //               key={role.id_role}
// //               control={
// //                 <Checkbox
// //                   checked={selectedRoles.includes(role.id_role)}
// //                   onChange={(e) => {
// //                     if (e.target.checked) {
// //                       setSelectedRoles(prev => [...prev, role.id_role]);
// //                     } else {
// //                       setSelectedRoles(prev => prev.filter(id => id !== role.id_role));
// //                     }
// //                   }}
// //                 />
// //               }
// //               label={role.role_name}
// //             />
// //           ))}
// //         </Box>
// //       )}

// //       {/* ספרים שהוקצו */}
// //       {books.length === 0 ? (
// //         <Typography>כרגע אין ספרים שאתה עובד עליהם</Typography>
// //       ) : (
// //         books.map((book) => (
// //           <Box
// //             key={book.id_book}
// //             display="flex"
// //             justifyContent="space-between"
// //             alignItems="center"
// //             mb={1}
// //             borderBottom="1px solid #ddd"
// //             pb={1}
// //           >
// //             <Box>
// //               <Typography variant="subtitle1">{book.title}</Typography>
// //               <Typography variant="body2" color="textSecondary">
// //                 תפקיד: {book.role_name}
// //               </Typography>
// //             </Box>
// //             <Button
// //               variant="outlined"
// //               color={book.is_completed ? "success" : "primary"}
// //               onClick={() => markAsCompleted(book.id_book)}
// //               disabled={book.is_completed}
// //             >
// //               {book.is_completed ? "✔ סומן" : "סמן כסיום"}
// //             </Button>
// //           </Box>
// //         ))
// //       )}
// //     </Box>
// //   );
// // };

// // export default AssignedBooksList;


// import React, { useEffect, useState } from "react";
// import {
//   Box,
//   Typography,
//   Button,
//   CircularProgress,
//   TextField,
//   FormControlLabel,
//   Checkbox,
// } from "@mui/material";
// import { APIrequests } from "../../APIrequests";

// const AssignedBooksList = ({ employeeId, initialBooks = [] }) => {
//   const [books, setBooks] = useState(initialBooks);
//   const [loading, setLoading] = useState(initialBooks.length === 0);
//   const [bookId, setBookId] = useState("");
//   const [availableRoles, setAvailableRoles] = useState([]);
//   const [selectedRoles, setSelectedRoles] = useState([]);
//   const api = new APIrequests();

//   useEffect(() => {
//     if (initialBooks.length === 0) fetchAssignedBooks();
//     else setLoading(false);

//     fetchAvailableRoles();
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

//   const fetchAvailableRoles = async () => {
//     try {
//       const data = await api.getRequest(`/employee-roles/by-employee/${employeeId}`);
//       setAvailableRoles(data);
//     } catch (error) {
//       console.error("Failed to fetch roles", error);
//     }
//   };

//   const handleAddBook = async () => {
//     if (!bookId || selectedRoles.length === 0) return;

//     try {
//       await api.postRequest(`/book-assignments/assign`, {
//         AZ_book_id: bookId,
//         employeeId,
//         selectedRoleIds: selectedRoles,
//       });

//       const newBooks = selectedRoles.map(roleId => {
//         const role = availableRoles.find(r => r.id_role === roleId);
//         return {
//           id_book: parseInt(bookId),
//           title: `ספר ${bookId}`,
//           role_name: role?.role_name || "תפקיד",
//           is_completed: 0,
//         };
//       });

//       setBooks(prev => [...prev, ...newBooks]);
//       setBookId("");
//       setSelectedRoles([]);
//     } catch (error) {
//       console.error("Failed to assign book", error);
//     }
//   };

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
//       {/* הוספת ספר */}
//       <Box mb={2} pb={2} borderBottom="1px solid #ccc">
//         <Box display="flex" alignItems="center" gap={2}>
//           <Typography variant="h6">הוסף ספר</Typography>

//           <TextField
//             label="Book ID"
//             value={bookId}
//             onChange={(e) => setBookId(e.target.value)}
//             size="small"
//             sx={{ flex: 1 }}
//           />

//           <Button
//             onClick={handleAddBook}
//             variant="contained"
//             color="primary"
//             disabled={!bookId || selectedRoles.length === 0}
//           >
//             שמור
//           </Button>
//         </Box>

//         {/* בחירת תפקידים */}
//         <Box mt={2}>
//           <Typography variant="body2" gutterBottom>בחר תפקידים:</Typography>

//           {availableRoles.length > 0 ? (
//             <Box display="flex" flexWrap="wrap" gap={2}>
//               {availableRoles.map(role => (
//                 <FormControlLabel
//                   key={role.id_role}
//                   control={
//                     <Checkbox
//                       checked={selectedRoles.includes(role.id_role)}
//                       onChange={(e) => {
//                         if (e.target.checked) {
//                           setSelectedRoles(prev => [...prev, role.id_role]);
//                         } else {
//                           setSelectedRoles(prev => prev.filter(id => id !== role.id_role));
//                         }
//                       }}
//                     />
//                   }
//                   label={role.role_name}
//                 />
//               ))}
//             </Box>
//           ) : (
//             <Typography color="textSecondary">אין תפקידים זמינים</Typography>
//           )}
//         </Box>
//       </Box>

//       {/* ספרים שהוקצו */}
//       {books.length === 0 ? (
//         <Typography>כרגע אין ספרים שאתה עובד עליהם</Typography>
//       ) : (
//         books.map((book, index) => (
//           <Box
//             key={`${book.id_book}-${book.role_name}-${index}`}
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
//               color={book.is_completed ? "success" : "primary"}
//               onClick={() => markAsCompleted(book.id_book)}
//               disabled={book.is_completed}
//             >
//               {book.is_completed ? "✔ סומן" : "סמן כסיום"}
//             </Button>
//           </Box>
//         ))
//       )}
//     </Box>
//   );
// };

// export default AssignedBooksList;
