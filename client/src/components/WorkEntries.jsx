import React, { useState } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Button } from "@mui/material";
import UpdateWorkDialog from "./UpdateWorkDialog"; // Import the dialog for work update

const WorkEntries = ({ workEntries, onUpdate }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedWork, setSelectedWork] = useState(null);

  // Function to open the dialog with the selected work data for update
  const handleUpdate = (log) => {
    setSelectedWork(log); // Set the selected work data
    setOpenDialog(true); // Open the dialog
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedWork(null);
  };

  return (
    <div>
      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><Typography variant="subtitle1" fontWeight="bold">Date</Typography></TableCell>
              <TableCell><Typography variant="subtitle1" fontWeight="bold">Book Title</Typography></TableCell>
              <TableCell><Typography variant="subtitle1" fontWeight="bold">Work Amount</Typography></TableCell>
              <TableCell><Typography variant="subtitle1" fontWeight="bold">Description</Typography></TableCell>
              <TableCell><Typography variant="subtitle1" fontWeight="bold">Notes</Typography></TableCell>
              <TableCell><Typography variant="subtitle1" fontWeight="bold">Update</Typography></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {workEntries.map((log) => (
              <TableRow key={log.id_work_entries}>
                <TableCell>{new Date(log.date).toLocaleDateString()}</TableCell>
                <TableCell>{log.project_name}</TableCell>
                <TableCell>
                  {parseFloat(log.quantity).toFixed(2).replace(/\.00$/, '')} {log.rate_type}
                </TableCell>
                <TableCell>{log.description_work}</TableCell>
                <TableCell>{log.notes}</TableCell>
                <TableCell>
                  <Button size="small" variant="outlined" color="primary" onClick={() => handleUpdate(log)}>
                    Update
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog for work update */}
      {selectedWork && (
        <UpdateWorkDialog
          open={openDialog}
          onClose={handleCloseDialog}
          workData={selectedWork}
          onUpdate={onUpdate}
        />
      )}
    </div>
  );
};

export default WorkEntries;