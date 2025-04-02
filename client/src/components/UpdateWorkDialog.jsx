// import React, { useState, useEffect } from "react";
// import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, Box, Typography } from "@mui/material";

// const UpdateWorkDialog = ({ open, onClose, workData, onUpdate }) => {
//   const [updatedWork, setUpdatedWork] = useState({
//     id_work_logs: "", // Initialize work ID
//     date: "", // Initialize date
//     work_quantity: "",
//     description: "",
//     notes: "",
//   });

//   // If workData changes, update the state
//   useEffect(() => {
//     if (workData) {
//       // Convert the date to YYYY-MM-DD format
//       const localDate = workData.date ? new Date(workData.date).toLocaleDateString("en-CA") : ""; // "en-CA" ensures YYYY-MM-DD format
//       setUpdatedWork({
//         id_work_logs: workData.id_work_logs, // Update the ID
//         date: localDate, // Use the local date
//         work_quantity: workData.work_quantity || "",
//         description: workData.description || "",
//         notes: workData.notes || "",
//       });
//     }
//   }, [workData]);

//   const handleSave = () => {
//     if (updatedWork.work_quantity && updatedWork.description) {
//       onUpdate(updatedWork); // Send update to the parent
//       onClose(); // Close the dialog after updating
//     } else {
//       alert("Please fill in all fields.");
//     }
//   };

//   return (
//     <Dialog open={open} onClose={onClose}>
//       <DialogTitle>Update Work</DialogTitle>
//       <DialogContent>
//         {workData && (
//           <Box display="flex" justifyContent="space-between" mb={2}>
//             <Typography variant="h6">{workData.title}</Typography>
//             <Typography variant="subtitle1" color="textSecondary">
//               {new Date(workData.date).toLocaleDateString()}
//             </Typography>
//           </Box>
//         )}
//         {/* <TextField
//           label="Work Quantity"
//           value={updatedWork.work_quantity || ""}
//           onChange={(e) => setUpdatedWork({ ...updatedWork, work_quantity: e.target.value })}
//           fullWidth
//           margin="normal"
//           type="number"
//           sx={{
//             "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button": {
//               display: "none",
//             },
//             "& input[type=number]": {
//               MozAppearance: "textfield",
//             },
//           }}
//         /> */}

//         <TextField
//           label="Work Quantity"
//           value={
//             updatedWork.work_quantity
//               ? (parseFloat(updatedWork.work_quantity) % 1 === 0
//                 ? parseInt(updatedWork.work_quantity)
//                 : updatedWork.work_quantity)
//               : ""
//           }
//           onChange={(e) => setUpdatedWork({ ...updatedWork, work_quantity: e.target.value })}
//           fullWidth
//           margin="normal"
//           type="number"
//           sx={{
//             "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button": {
//               display: "none",
//             },
//             "& input[type=number]": {
//               MozAppearance: "textfield",
//             },
//           }}
//         />


//         <TextField
//           label="Description"
//           value={updatedWork.description || ""}
//           onChange={(e) => setUpdatedWork({ ...updatedWork, description: e.target.value })}
//           fullWidth
//           margin="normal"
//         />
//         <TextField
//           label="Notes"
//           value={updatedWork.notes || ""}
//           onChange={(e) => setUpdatedWork({ ...updatedWork, notes: e.target.value })}
//           fullWidth
//           margin="normal"
//         />
//       </DialogContent>
//       <DialogActions>
//         <Button onClick={onClose} color="secondary">Cancel</Button>
//         <Button onClick={handleSave} color="primary">Save Changes</Button>
//       </DialogActions>
//     </Dialog>
//   );
// };

// export default UpdateWorkDialog;



import React, { useState, useEffect } from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, Box, Typography, FormHelperText } from "@mui/material";

const UpdateWorkDialog = ({ open, onClose, workData, onUpdate }) => {
  const [updatedWork, setUpdatedWork] = useState({
    id_work_logs: "", // Initialize work ID
    date: "", // Initialize date
    work_quantity: "",
    description: "",
    notes: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (workData) {
      // Convert the date to YYYY-MM-DD format
      const localDate = workData.date ? new Date(workData.date).toLocaleDateString("en-CA") : ""; // "en-CA" ensures YYYY-MM-DD format
      setUpdatedWork({
        id_work_logs: workData.id_work_logs, // Update the ID
        date: localDate, // Use the local date
        work_quantity: workData.work_quantity || "",
        description: workData.description || "",
        notes: workData.notes || "",
      });
    }
  }, [workData]);

  const handleSave = () => {
    let newErrors = {};

    // Check if fields are empty and add errors
    if (!updatedWork.work_quantity) newErrors.work_quantity = "This field is required";
    if (!updatedWork.description) newErrors.description = "This field is required";

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      onUpdate(updatedWork); // Send update to the parent
      onClose(); // Close the dialog after updating
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Update Work</DialogTitle>
      <DialogContent>
        {workData && (
          <Box display="flex" justifyContent="space-between" mb={2}>
            <Typography variant="h6">{workData.title}</Typography>
            <Typography variant="subtitle1" color="textSecondary">
              {new Date(workData.date).toLocaleDateString()}
            </Typography>
          </Box>
        )}

        {/* <TextField
          label="Work Quantity"
          value={updatedWork.work_quantity || ""}
          onChange={(e) => setUpdatedWork({ ...updatedWork, work_quantity: e.target.value })}
          fullWidth
          margin="normal"
          type="number"
          error={!!errors.work_quantity}
          helperText={errors.work_quantity}
          sx={{
            "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button": {
              display: "none",
            },
            "& input[type=number]": {
              MozAppearance: "textfield",
            },
          }}
        /> */}



        <TextField
          label="Work Quantity"
          value={
            updatedWork.work_quantity
              ? (parseFloat(updatedWork.work_quantity) % 1 === 0
                ? parseInt(updatedWork.work_quantity)
                : updatedWork.work_quantity)
              : ""
          }
          onChange={(e) => setUpdatedWork({ ...updatedWork, work_quantity: e.target.value })}
          fullWidth
          margin="normal"
          type="number"
          error={!!errors.work_quantity}
          helperText={errors.work_quantity}

          sx={{
            "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button": {
              display: "none",
            },
            "& input[type=number]": {
              MozAppearance: "textfield",
            },
          }}
        />


        <TextField
          label="Description"
          value={updatedWork.description || ""}
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
        <Button onClick={onClose} color="secondary">Cancel</Button>
        <Button onClick={handleSave} color="primary">Save Changes</Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpdateWorkDialog;
