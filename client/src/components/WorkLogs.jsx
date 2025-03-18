import React from "react";
import { Box, Typography } from "@mui/material";

const WorkLogs = ({ workLogs }) => {
  return (
    <Box sx={{ mb: 2 }}>
      {workLogs.map((log) => (
        <Box key={log.id} sx={{ borderBottom: "1px solid #ddd", paddingBottom: 1, marginBottom: 1 }}>
          <Typography variant="h6">{log.bookTitle}</Typography>
          <Typography variant="body2">Hours Worked: {log.hoursWorked}</Typography>
          <Typography variant="body2">Comments: {log.comments}</Typography>
        </Box>
      ))}
    </Box>
  );
};

export default WorkLogs;
