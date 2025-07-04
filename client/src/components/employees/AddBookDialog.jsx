import { useEffect, useState } from "react";
import { TextField, Typography, Button, Checkbox, FormControlLabel, Box, Alert } from "@mui/material";
import { APIrequests } from "../../APIrequests";
import { useTranslation } from "react-i18next";
import InputAdornment from "@mui/material/InputAdornment";

const AddBookDialog = ({ employeeId, onSuccess }) => {
  const [bookId, setBookId] = useState('AZ-');
  const [availableRoles, setAvailableRoles] = useState([]);
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [systemError, setSystemError] = useState('');
  const [success, setSuccess] = useState('');
  const [bookIdError, setBookIdError] = useState(false);
  const [rolesError, setRolesError] = useState(false);
  const { t } = useTranslation();

  const api = new APIrequests();

  useEffect(() => {
    const fetchRoles = async () => {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const roleIds = user.roles || [];

      if (roleIds.length > 1) {
        try {
          const response = await api.getRequest(`/roles?ids=${roleIds.join(',')}`);
          setAvailableRoles(response);
        } catch (error) {
          console.error("Failed to fetch role names", error);
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
    try {
      const response = await api.postRequest(`/book-assignments`, {
        bookClickUpId: bookId,
        employeeId,
        selectedRoleIds
      });

      if (response?.inserted) {
        setBookId('AZ-');
        setSelectedRoles([]);
        onSuccess?.(response.book);
      } else {
        setSystemError(response?.message || "הוספת הספר נכשלה");
      }
    } catch (error) {
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
      {(systemError || success) && (
        <Alert severity={systemError ? "error" : "success"} sx={{ mb: 1 }}>
          {systemError || success}
        </Alert>
      )}

      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        gap={1}
        flexWrap="wrap"
      >
        <Typography variant="subtitle1" sx={{ whiteSpace: 'nowrap' }}>
          {t("addBook.title")}
        </Typography>

        <TextField
          label={t("addBook.bookId")}
          value={bookId}
          onChange={(e) => {
            const input = e.target.value;
            if (!input.startsWith("AZ-")) return;
            setBookId(input);
          }}
          size="small"
          error={bookIdError}
          helperText={bookIdError ? t("addBook.bookIdError") : ""}
          sx={{
            '& input': {
              textAlign: 'left'
            }
          }}
        />

        <Button
          variant="contained"
          color="primary"
          size="small"
          onClick={handleAddBook}
          sx={{ minWidth: 64 }}
        >
          {t("addBook.save")}
        </Button>
      </Box>

      {availableRoles.length > 1 && (
        <>
          <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
            <Box display="flex" alignItems="center" sx={{ whiteSpace: 'nowrap' }}>
              <Typography variant="body2" sx={{ mr: 0.5 }}>
                {t("addBook.selectRoles")}
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
              {t("addBook.roleError")}
            </Typography>
          )}
        </>
      )}
    </Box>
  );
};

export default AddBookDialog;
