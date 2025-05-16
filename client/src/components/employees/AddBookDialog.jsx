// // import React, { useEffect, useState } from "react";
// // import {
// //     TextField,
// //     Typography,
// //     Button,
// //     Checkbox,
// //     FormControlLabel,
// //     Box
// // } from "@mui/material";
// // import { APIrequests } from "../../APIrequests";

// // const AddBookDialog = ({ employeeId, onSuccess }) => {
// //     const [bookId, setBookId] = useState('');
// //     const [availableRoles, setAvailableRoles] = useState([]);
// //     const [selectedRoles, setSelectedRoles] = useState([]);

// //     const api = new APIrequests();

// //     useEffect(() => {
// //         const fetchRoles = async () => {
// //             const user = JSON.parse(localStorage.getItem("user") || "{}");
// //             const roleIds = user.roles || [];

// //             if (roleIds.length > 1) {
// //                 try {
// //                     const response = await api.getRequest(`/roles?ids=${roleIds.join(',')}`);
// //                     setAvailableRoles(response);
// //                 } catch (err) {
// //                     console.error("Failed to fetch role names", err);
// //                 }
// //             } else if (roleIds.length === 1) {
// //                 setAvailableRoles([{ id_role: roleIds[0], role_name: "תפקיד יחיד" }]);
// //             }
// //         };

// //         fetchRoles();
// //     }, []);

// //     const handleAddBook = async () => {
// //         if (!bookId) return alert("אנא הזן Book ID");

// //         const selectedRoleIds = availableRoles.length === 1
// //             ? [availableRoles[0].id_role]
// //             : selectedRoles;

// //         if (selectedRoleIds.length === 0) return alert("בחר לפחות תפקיד אחד");

// //         try {
// //             await api.postRequest(`/book-assignments`, {
// //                 bookClickUpId: bookId,
// //                 employeeId,
// //                 selectedRoleIds
// //             });

// //             setBookId('');
// //             setSelectedRoles([]);
// //             onSuccess?.();
// //         } catch (err) {
// //             alert("שגיאה בהוספת הספר");
// //         }
// //     };

// //     return (
// //   <Box
// //     mt={2}
// //     p={1}
// //     border="1px solid #ddd"
// //     borderRadius="6px"
// //     display="flex"
// //     flexDirection="column"
// //     gap={1}
// //     maxWidth="90%"
// //       mx="auto"  // 👈 זה מרכז את הקופסה
// //     sx={{ backgroundColor: "#fafafa" }} // צבע רקע בהיר ועדין
// //   >
// //     {/* שורת פרטי הספר */}
// //     <Box
// //       display="flex"
// //       alignItems="center"
// //       justifyContent="space-between"
// //       gap={1}
// //       flexWrap="wrap"
// //     >
// //       <Typography variant="subtitle1" sx={{ whiteSpace: 'nowrap' }}>
// //         הוספת ספר חדש
// //       </Typography>

// //       <TextField
// //         label="Book ID"
// //         value={bookId}
// //         onChange={(e) => setBookId(e.target.value)}
// //         size="small"
// //       />

// //       <Button
// //         variant="contained"
// //         color="primary"
// //         size="small"
// //         onClick={handleAddBook}
// //         sx={{ minWidth: 64 }}
// //       >
// //         שמור
// //       </Button>
// //     </Box>

// //     {/* תפקידים */}
// //     {availableRoles.length > 0 && (
// //       <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
// //         <Box display="flex" alignItems="center" sx={{ whiteSpace: 'nowrap' }}>
// //           <Typography variant="body2" sx={{ mr: 0.5 }}>
// //             בחר תפקידים:
// //           </Typography>
// //         </Box>

// //         {availableRoles.map(role => (
// //           <FormControlLabel
// //             key={role.id_role}
// //             control={
// //               <Checkbox
// //                 checked={selectedRoles.includes(role.id_role)}
// //                 onChange={(e) => {
// //                   if (e.target.checked) {
// //                     setSelectedRoles(prev => [...prev, role.id_role]);
// //                   } else {
// //                     setSelectedRoles(prev => prev.filter(id => id !== role.id_role));
// //                   }
// //                 }}
// //                 size="small"
// //               />
// //             }
// //             label={role.role_name}
// //             sx={{ m: 0 }}
// //           />
// //         ))}
// //       </Box>
// //     )}
// //   </Box>
// // );

// // };

// // export default AddBookDialog;

import React, { useEffect, useState } from "react";
import {
  TextField,
  Typography,
  Button,
  Checkbox,
  FormControlLabel,
  Box,
  Alert
} from "@mui/material";
import { APIrequests } from "../../APIrequests";

const AddBookDialog = ({ employeeId, onSuccess }) => {
  const [bookId, setBookId] = useState('');
  const [availableRoles, setAvailableRoles] = useState([]);
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [systemError, setSystemError] = useState('');
  const [success, setSuccess] = useState('');
  const [bookIdError, setBookIdError] = useState(false);
  const [rolesError, setRolesError] = useState(false);

  const api = new APIrequests();

  useEffect(() => {
    const fetchRoles = async () => {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const roleIds = user.roles || [];

      if (roleIds.length > 1) {
        try {
          const response = await api.getRequest(`/roles?ids=${roleIds.join(',')}`);
          setAvailableRoles(response);
        } catch (err) {
          console.error("Failed to fetch role names", err);
        }
      } else if (roleIds.length === 1) {
        setAvailableRoles([{ id_role: roleIds[0], role_name: "תפקיד יחיד" }]);
      }
    };

    fetchRoles();
  }, []);

  const handleAddBook = async () => {
    setSystemError('');
    setSuccess('');
    setBookIdError(false);
    setRolesError(false);

    const selectedRoleIds = availableRoles.length === 1
      ? [availableRoles[0].id_role]
      : selectedRoles;

    let hasError = false;

    if (!bookId) {
      setBookIdError(true);
      hasError = true;
    }

    if (selectedRoleIds.length === 0) {
      setRolesError(true);
      hasError = true;
    }

    if (hasError) return;

    // try {
    //   await api.postRequest(`/book-assignments`, {
    //     bookClickUpId: bookId,
    //     employeeId,
    //     selectedRoleIds
    //   });

    //   setBookId('');
    //   setSelectedRoles([]);
    //   setSuccess("הספר נוסף בהצלחה!");
    //   onSuccess?.();
    // } catch (err) {
    //   setSystemError("שגיאה בהוספת הספר");
    // }

    try {
  const response = await api.postRequest(`/book-assignments`, {
    bookClickUpId: bookId,
    employeeId,
    selectedRoleIds
  });

  if (response?.success) {
    setBookId('');
    setSelectedRoles([]);
    setSuccess("הספר נוסף בהצלחה!");
    onSuccess?.();
  } else {
    // במקרה שהשרת מחזיר success: false
    setSystemError(response?.message || "הוספת הספר נכשלה");
  }
} catch (err) {
  setSystemError("שגיאה בהוספת הספר");
}

  };

  return (
    <Box
      mt={2}
      p={1}
      border="1px solid #ddd"
      borderRadius="6px"
      display="flex"
      flexDirection="column"
      gap={1}
      maxWidth="90%"
      mx="auto"
      sx={{ backgroundColor: "#fafafa" }}
    >
      {/* הודעת מערכת */}
      {(systemError || success) && (
        <Alert severity={systemError ? "error" : "success"} sx={{ mb: 1 }}>
          {systemError || success}
        </Alert>
      )}

      {/* שורת פרטי הספר */}
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        gap={1}
        flexWrap="wrap"
      >
        <Typography variant="subtitle1" sx={{ whiteSpace: 'nowrap' }}>
          הוספת ספר חדש
        </Typography>

        <TextField
          label="Book ID"
          value={bookId}
          onChange={(e) => setBookId(e.target.value)}
          size="small"
          error={bookIdError}
          helperText={bookIdError ? "יש להזין Book ID" : ""}
        />

        <Button
          variant="contained"
          color="primary"
          size="small"
          onClick={handleAddBook}
          sx={{ minWidth: 64 }}
        >
          שמור
        </Button>
      </Box>

      {/* תפקידים */}
      {availableRoles.length > 0 && (
        <>
          <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
            <Box display="flex" alignItems="center" sx={{ whiteSpace: 'nowrap' }}>
              <Typography variant="body2" sx={{ mr: 0.5 }}>
                בחר תפקידים:
              </Typography>
            </Box>

            {availableRoles.map(role => (
              <FormControlLabel
                key={role.id_role}
                control={
                  <Checkbox
                    checked={selectedRoles.includes(role.id_role)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedRoles(prev => [...prev, role.id_role]);
                      } else {
                        setSelectedRoles(prev => prev.filter(id => id !== role.id_role));
                      }
                    }}
                    size="small"
                  />
                }
                label={role.role_name}
                sx={{ m: 0 }}
              />
            ))}
          </Box>
          {rolesError && (
            <Typography color="error" variant="caption" sx={{ ml: 4 }}>
              יש לבחור לפחות תפקיד אחד
            </Typography>
          )}
        </>
      )}
    </Box>
  );
};

export default AddBookDialog;
