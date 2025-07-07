import React from "react";
import { Alert, Snackbar } from "@mui/material";

const AppAlert = ({ open, onClose, message, severity = "info", autoHideDuration = 3000 }) => {
  return (
    <Snackbar
      open={open}
      onClose={onClose}
      autoHideDuration={autoHideDuration}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
    >
      <Alert
        onClose={onClose}
        severity={severity}
        variant="filled"
        sx={{ width: "100%", fontWeight: "bold", fontSize: "1rem" }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default AppAlert;
