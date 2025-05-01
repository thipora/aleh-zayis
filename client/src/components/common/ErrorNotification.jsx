import React from "react";
import { Typography } from "@mui/material";

const ErrorNotification = ({ error }) => {
  return error ? (
    <Typography color="error" variant="body2" gutterBottom>
      {error}
    </Typography>
  ) : null;
};

export default ErrorNotification;
