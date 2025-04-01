import React, { useState } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Button } from "@mui/material";
import UpdateWorkDialog from "./UpdateWorkDialog"; // נייבא את הדיאלוג שיצרנו לעדכון העבודה

const WorkLogs = ({ workLogs, onUpdate }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedWork, setSelectedWork] = useState(null);

  // פונקציה שתפתח את הדיאלוג עם הנתונים של העבודה לצורך עדכון
  const handleUpdate = (log) => {
    setSelectedWork(log); // מכניס את המידע של העבודה הנבחרת
    setOpenDialog(true); // פותח את הדיאלוג
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
              <TableCell><Typography variant="subtitle1" fontWeight="bold">תאריך</Typography></TableCell>
              <TableCell><Typography variant="subtitle1" fontWeight="bold">שם הספר</Typography></TableCell>
              <TableCell><Typography variant="subtitle1" fontWeight="bold">כמות</Typography></TableCell>
              <TableCell><Typography variant="subtitle1" fontWeight="bold">תאור</Typography></TableCell>
              <TableCell><Typography variant="subtitle1" fontWeight="bold">הערות</Typography></TableCell>
              <TableCell><Typography variant="subtitle1" fontWeight="bold">עדכון</Typography></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {workLogs.map((log) => (
              <TableRow key={log.id_work_logs}>
                <TableCell>{new Date(log.date).toLocaleDateString()}</TableCell>
                <TableCell>{log.title}</TableCell>
                <TableCell>
                  {parseFloat(log.work_quantity).toFixed(2).replace(/\.00$/, '')}{" "}
                  {/* {log.is_special_work ? log.special_payment_type : log.payment_type} */}
            {log.payment_type}
                  </TableCell>
                <TableCell>
                  {log.description}
                </TableCell>
                <TableCell>{log.notes}</TableCell>
                <TableCell>
                  <Button size="small" variant="outlined" color="primary" onClick={() => handleUpdate(log)}>
                    עדכון
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* דיאלוג לעדכון עבודה */}
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

export default WorkLogs;
