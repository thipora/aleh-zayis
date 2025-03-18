import React from "react";
import { Box, TextField, Button } from "@mui/material";

const WorkForm = ({ newWork, setNewWork, handleAddWork }) => {
  return (
    <Box sx={{ mb: 3 }}>
      <TextField
        label="Book ID"
        value={newWork.bookId}
        onChange={(e) => setNewWork({ ...newWork, bookId: e.target.value })}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Hours Worked"
        value={newWork.hoursWorked}
        onChange={(e) => setNewWork({ ...newWork, hoursWorked: e.target.value })}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Comments"
        value={newWork.comments}
        onChange={(e) => setNewWork({ ...newWork, comments: e.target.value })}
        fullWidth
        margin="normal"
      />
      <Button variant="contained" onClick={handleAddWork} fullWidth>
        Add Work
      </Button>
    </Box>
  );
};

export default WorkForm;
