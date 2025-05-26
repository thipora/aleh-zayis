
import React, { useState } from "react";
import {
  Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, Typography, Button
} from "@mui/material";
import UpdateWorkDialog from "./UpdateWorkDialog";
import { useTranslation } from "react-i18next";


// פונקציה להצגת כמות שעות בפורמט "שעות ודקות"
// function decimalToDurationString(quantity) {
//   if (typeof quantity !== "number" && typeof quantity !== "string") return "";
//   const q = parseFloat(quantity);
//   if (isNaN(q)) return "";
//   const hours = Math.floor(q);
//   const minutes = Math.round((q - hours) * 60);
//   let str = "";
//   if (hours > 0) str += `${hours} שעות`;
//   if (minutes > 0) str += (hours > 0 ? " ו-" : "") + `${minutes} דקות`;
//   if (!str) str = "0 דקות";
//   return str;
// }
function useDurationFormatter() {
  const { t } = useTranslation();

  return (quantity) => {
    if (typeof quantity !== "number" && typeof quantity !== "string") return "";
    const q = parseFloat(quantity);
    if (isNaN(q)) return "";
    const hours = Math.floor(q);
    const minutes = Math.round((q - hours) * 60);
    let parts = [];

    if (hours > 0) parts.push(`${hours} ${t("duration.hours")}`);
    if (minutes > 0) parts.push(`${minutes} ${t("duration.minutes")}`);
    if (parts.length === 0) return `0 ${t("duration.minutes")}`;

    return parts.join(` ${t("duration.and")} `);
  };
}


const WorkEntries = ({ workEntries, onUpdate, allowUpdate = true }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedWork, setSelectedWork] = useState(null);
  const { t } = useTranslation();
  const formatDuration = useDurationFormatter();

  const handleUpdate = (log) => {
    setSelectedWork(log);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedWork(null);
  };

  const isToday = (dateString) => {
    const entryDate = new Date(dateString);
    const today = new Date();

    return (
      entryDate.getFullYear() === today.getFullYear() &&
      entryDate.getMonth() === today.getMonth() &&
      entryDate.getDate() === today.getDate()
    );
  };


  // return (
  //   <div>
  //     <TableContainer component={Paper} sx={{ mt: 2 }}>
  //       <Table>
  //         <TableHead>
  //           <TableRow>
  //             <TableCell>
  //               <Typography variant="subtitle1" fontWeight="bold">Date</Typography>
  //             </TableCell>
  //             <TableCell>
  //               <Typography variant="subtitle1" fontWeight="bold">AZ-id</Typography>
  //             </TableCell>
  //             <TableCell>
  //               <Typography variant="subtitle1" fontWeight="bold">Book Title</Typography>
  //             </TableCell>
  //             <TableCell>
  //               <Typography variant="subtitle1" fontWeight="bold">Project Manager</Typography>
  //             </TableCell>
  //             <TableCell>
  //               <Typography variant="subtitle1" fontWeight="bold">Work Amount</Typography>
  //             </TableCell>
  //             <TableCell>
  //               <Typography variant="subtitle1" fontWeight="bold">Time Range</Typography>
  //             </TableCell>
  //             <TableCell>
  //               <Typography variant="subtitle1" fontWeight="bold">Description</Typography>
  //             </TableCell>
  //             <TableCell>
  //               <Typography variant="subtitle1" fontWeight="bold">Notes</Typography>
  //             </TableCell>
  //             {allowUpdate && (
  //               <TableCell>
  //                 <Typography variant="subtitle1" fontWeight="bold">Update</Typography>
  //               </TableCell>
  //             )}
  //           </TableRow>
  //         </TableHead>
  //         <TableBody>
  //           {workEntries.map((log) => (
  //             <TableRow key={log.id_work_entries}>
  //               <TableCell>{new Date(log.date).toLocaleDateString()}</TableCell>
  //               <TableCell>{log.AZ_book_id}</TableCell>
  //               <TableCell>{log.book_name}</TableCell>
  //               <TableCell>{log.project_manager_name || ''}</TableCell>
  //               <TableCell>
  //                 {log.is_special_work
  //                   ? `${log.special_unit} ${parseInt(log.quantity)}`
  //                   : `${decimalToDurationString(log.quantity)}`}
  //               </TableCell>

  //               <TableCell>
  //                 {
  //                   (!log.is_special_work)
  //                     ? `${log.start_time.slice(0, 5)} - ${log.end_time.slice(0, 5)}`
  //                     : ""

  //                 }
  //               </TableCell>
  //               <TableCell>{log.description}</TableCell>
  //               <TableCell>{log.notes}</TableCell>
  //               <TableCell>
  //                 {allowUpdate && (
  //                   <Button
  //                     size="small"
  //                     variant="outlined"
  //                     color="primary"
  //                     onClick={() => handleUpdate(log)}
  //                     disabled={!isToday(log.date)}
  //                   >
  //                     Update
  //                   </Button>
  //                 )}
  //               </TableCell>
  //             </TableRow>
  //           ))}
  //         </TableBody>
  //       </Table>
  //     </TableContainer>

  //     {/* Dialog for work update */}
  //     {selectedWork && (
  //       <UpdateWorkDialog
  //         open={openDialog}
  //         onClose={handleCloseDialog}
  //         workData={selectedWork}
  //         onUpdate={onUpdate}
  //       />
  //     )}
  //   </div>
  // );
  return (
  <div>
    <TableContainer component={Paper} sx={{ mt: 2 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              <Typography variant="subtitle1" fontWeight="bold">{t("workEntries.date")}</Typography>
            </TableCell>
            <TableCell>
              <Typography variant="subtitle1" fontWeight="bold">{t("workEntries.azId")}</Typography>
            </TableCell>
            <TableCell>
              <Typography variant="subtitle1" fontWeight="bold">{t("workEntries.bookTitle")}</Typography>
            </TableCell>
            <TableCell>
              <Typography variant="subtitle1" fontWeight="bold">{t("workEntries.projectManager")}</Typography>
            </TableCell>
            <TableCell>
              <Typography variant="subtitle1" fontWeight="bold">{t("workEntries.workAmount")}</Typography>
            </TableCell>
            <TableCell>
              <Typography variant="subtitle1" fontWeight="bold">{t("workEntries.timeRange")}</Typography>
            </TableCell>
            <TableCell>
              <Typography variant="subtitle1" fontWeight="bold">{t("workEntries.description")}</Typography>
            </TableCell>
            <TableCell>
              <Typography variant="subtitle1" fontWeight="bold">{t("workEntries.notes")}</Typography>
            </TableCell>
            {allowUpdate && (
              <TableCell>
                <Typography variant="subtitle1" fontWeight="bold">{t("workEntries.update")}</Typography>
              </TableCell>
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {workEntries.map((log) => (
            <TableRow key={log.id_work_entries}>
              <TableCell>{new Date(log.date).toLocaleDateString()}</TableCell>
              <TableCell>{log.AZ_book_id}</TableCell>
              <TableCell>{log.book_name}</TableCell>
              <TableCell>{log.project_manager_name || ''}</TableCell>
              <TableCell>
                {log.is_special_work
                  ? `${log.special_unit} ${parseInt(log.quantity)}`
                  : `${formatDuration(log.quantity)}`}
              </TableCell>
              <TableCell>
                {!log.is_special_work
                  ? `${log.start_time.slice(0, 5)} - ${log.end_time.slice(0, 5)}`
                  : ""}
              </TableCell>
              <TableCell>{log.description}</TableCell>
              <TableCell>{log.notes}</TableCell>
              <TableCell>
                {allowUpdate && (
                  <Button
                    size="small"
                    variant="outlined"
                    color="primary"
                    onClick={() => handleUpdate(log)}
                    disabled={!isToday(log.date)}
                  >
                    {t("workEntries.update")}
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>

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