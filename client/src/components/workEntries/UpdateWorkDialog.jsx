// import React, { useState, useEffect } from "react";
// import {
//   Dialog, DialogActions, DialogContent, DialogTitle,
//   TextField, Button, Box, Typography
// } from "@mui/material";

// // פונקציה להמרה עשרוני -> שעות/דקות
// function decimalToHM(quantity) {
//   const q = parseFloat(quantity);
//   if (isNaN(q)) return { hours: "", minutes: "" };
//   const hours = Math.floor(q);
//   const minutes = Math.round((q - hours) * 60);
//   return { hours: hours.toString(), minutes: minutes.toString() };
// }

// const UpdateWorkDialog = ({ open, onClose, workData, onUpdate }) => {
//   const [updatedWork, setUpdatedWork] = useState({
//     id_work_entries: "",
//     date: "",
//     hours: "",
//     minutes: "",
//     start_time: "",
//     end_time: "",
//     description: "",
//     notes: "",
//   });

//   const [errors, setErrors] = useState({});

//   useEffect(() => {
//     if (workData) {
//       const localDate = workData.date
//         ? new Date(workData.date).toLocaleDateString("en-CA")
//         : "";

//       // פיצול quantity לשעות ודקות
//       const { hours, minutes } = decimalToHM(workData.quantity);

//       setUpdatedWork({
//         id_work_entries: workData.id_work_entries,
//         date: localDate,
//         hours,
//         minutes,
//         start_time: workData.start_time || "",
//         end_time: workData.end_time || "",
//         description: workData.description || "",
//         notes: workData.notes || "",
//       });
//     }
//   }, [workData]);

//   const handleSave = () => {
//     const newErrors = {};
//     if (!updatedWork.hours && !updatedWork.minutes)
//       newErrors.hours = "Enter hours or minutes";
//     if (
//       updatedWork.minutes &&
//       (isNaN(updatedWork.minutes) ||
//         updatedWork.minutes < 0 ||
//         updatedWork.minutes > 59)
//     )
//       newErrors.minutes = "Minutes must be between 0 and 59";
//     if (!updatedWork.description) newErrors.description = "This field is required";
//     if (
//       updatedWork.start_time &&
//       updatedWork.end_time &&
//       updatedWork.end_time < updatedWork.start_time
//     )
//       newErrors.end_time = "End time must be after start time";

//     setErrors(newErrors);

//     if (Object.keys(newErrors).length === 0) {
//       // חישוב ערך עשרוני חדש:
//       const h = parseInt(updatedWork.hours || 0, 10);
//       const m = parseInt(updatedWork.minutes || 0, 10);
//       const quantity = (h + m / 60).toFixed(3);

//       onUpdate({
//         ...workData,
//         quantity,
//         start_time: updatedWork.start_time || null,
//         end_time: updatedWork.end_time || null,
//         description: updatedWork.description,
//         notes: updatedWork.notes,
//       });
//       onClose();
//     }
//   };

//   return (
//     <Dialog open={open} onClose={onClose}>
//       <DialogTitle>Update Work Entry</DialogTitle>
//       <DialogContent>
//         {workData && (
//           <Box display="flex" justifyContent="space-between" mb={2}>
//             {workData.project_name && (
//               <Typography variant="h6">{workData.project_name}</Typography>
//             )}
//             <Typography variant="subtitle1" color="textSecondary">
//               {new Date(workData.date).toLocaleDateString()}
//             </Typography>
//           </Box>
//         )}

//           <Box sx={{ display: "flex", gap: 2 }}>
//             <TextField
//               label="Start Time"
//               name="start_time"
//               type="time"
//               value={updatedWork.start_time || ""}
//               onChange={(e) =>
//                 setUpdatedWork({ ...updatedWork, start_time: e.target.value })
//               }
//               InputLabelProps={{ shrink: true }}
//               inputProps={{ step: 300 }}
//               fullWidth
//               error={!!errors.start_time}
//             />
//             <TextField
//               label="End Time"
//               name="end_time"
//               type="time"
//               value={updatedWork.end_time || ""}
//               onChange={(e) =>
//                 setUpdatedWork({ ...updatedWork, end_time: e.target.value })
//               }
//               InputLabelProps={{ shrink: true }}
//               inputProps={{ step: 300 }}
//               fullWidth
//               error={!!errors.end_time}
//               helperText={errors.end_time}
//             />
//           </Box>
//         {/* </Box> */}

//         <TextField
//           label="Description"
//           value={updatedWork.description}
//           onChange={(e) =>
//             setUpdatedWork({ ...updatedWork, description: e.target.value })
//           }
//           fullWidth
//           margin="normal"
//           error={!!errors.description}
//           helperText={errors.description}
//         />

//         <TextField
//           label="Notes"
//           value={updatedWork.notes || ""}
//           onChange={(e) =>
//             setUpdatedWork({ ...updatedWork, notes: e.target.value })
//           }
//           fullWidth
//           margin="normal"
//         />
//       </DialogContent>

//       <DialogActions>
//         <Button onClick={onClose} color="secondary">
//           Cancel
//         </Button>
//         <Button onClick={handleSave} color="primary">
//           Save Changes
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// };

// export default UpdateWorkDialog;

import React, { useState, useEffect } from "react";
import {
  Dialog, DialogActions, DialogContent, DialogTitle,
  TextField, Button, Box, Typography
} from "@mui/material";

function decimalToHM(quantity) {
  const q = parseFloat(quantity);
  if (isNaN(q)) return { hours: "", minutes: "" };
  const hours = Math.floor(q);
  const minutes = Math.round((q - hours) * 60);
  return { hours: hours.toString(), minutes: minutes.toString() };
}

const UpdateWorkDialog = ({ open, onClose, workData, onUpdate }) => {
  const [updatedWork, setUpdatedWork] = useState({
    id_work_entries: "",
    date: "",
    hours: "",
    minutes: "",
    start_time: "",
    end_time: "",
    description: "",
    notes: "",
    quantity: ""
  });

  const [errors, setErrors] = useState({});

  const isSpecial = workData?.is_special_work === 1;
  const specialUnit = workData?.special_unit || "Quantity";

  useEffect(() => {
    if (workData) {
      const localDate = workData.date
        ? new Date(workData.date).toLocaleDateString("en-CA")
        : "";
      const { hours, minutes } = decimalToHM(workData.quantity);

      setUpdatedWork({
        id_work_entries: workData.id_work_entries,
        date: localDate,
        hours,
        minutes,
        quantity: workData.quantity || "",
        start_time: workData.start_time || "",
        end_time: workData.end_time || "",
        description: workData.description || "",
        notes: workData.notes || "",
      });
    }
  }, [workData]);

  const handleSave = () => {
    const newErrors = {};

    if (!updatedWork.description)
      newErrors.description = "This field is required";

    if (isSpecial) {
      if (!updatedWork.quantity)
        newErrors.quantity = `Enter ${specialUnit.toLowerCase()}`;
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      const quantity = isSpecial
        ? updatedWork.quantity
        : (parseInt(updatedWork.hours || 0, 10) + parseInt(updatedWork.minutes || 0, 10) / 60).toFixed(3);

      onUpdate({
        ...workData,
        quantity,
        start_time: isSpecial ? null : updatedWork.start_time || null,
        end_time: isSpecial ? null : updatedWork.end_time || null,
        description: updatedWork.description,
        notes: updatedWork.notes,
      });
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Update Work Entry</DialogTitle>
      <DialogContent>
        {workData && (
          <Box display="flex" justifyContent="space-between" mb={2}>
            {workData.project_name && (
              <Typography variant="h6">{workData.project_name}</Typography>
            )}
            <Typography variant="subtitle1" color="textSecondary">
              {new Date(workData.date).toLocaleDateString()}
            </Typography>
          </Box>
        )}

        {isSpecial ? (
          <TextField
            label={specialUnit || "Quantity"}
            value={updatedWork.quantity}
            onChange={(e) => setUpdatedWork({ ...updatedWork, quantity: e.target.value })}
            fullWidth
            margin="normal"
            error={!!errors.quantity}
            helperText={errors.quantity}
          />
        ) : (
          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField
              label="Start Time"
              name="start_time"
              type="time"
              value={updatedWork.start_time || ""}
              onChange={(e) => setUpdatedWork({ ...updatedWork, start_time: e.target.value })}
              InputLabelProps={{ shrink: true }}
              inputProps={{ step: 300 }}
              fullWidth
              error={!!errors.start_time}
            />
            <TextField
              label="End Time"
              name="end_time"
              type="time"
              value={updatedWork.end_time || ""}
              onChange={(e) => setUpdatedWork({ ...updatedWork, end_time: e.target.value })}
              InputLabelProps={{ shrink: true }}
              inputProps={{ step: 300 }}
              fullWidth
              error={!!errors.end_time}
              helperText={errors.end_time}
            />
          </Box>
        )}

        <TextField
          label="Description"
          value={updatedWork.description}
          onChange={(e) => setUpdatedWork({ ...updatedWork, description: e.target.value })}
          fullWidth
          margin="normal"
          error={!!errors.description}
          helperText={errors.description}
        />

        <TextField
          label="Notes"
          value={updatedWork.notes || ""}
          onChange={(e) => setUpdatedWork({ ...updatedWork, notes: e.target.value })}
          fullWidth
          margin="normal"
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSave} color="primary">
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpdateWorkDialog;
