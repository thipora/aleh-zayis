// import React, { useState, useEffect } from "react";
// import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button } from "@mui/material";

// const UpdateWorkDialog = ({ open, onClose, workData, onUpdate }) => {
//   const [updatedWork, setUpdatedWork] = useState(workData);

//   useEffect(() => {
//     setUpdatedWork(workData); // עדכון הנתונים במידה והם השתנו
//   }, [workData]);

//   const handleSave = () => {
//     if (updatedWork.date && updatedWork.work_quantity && updatedWork.description) {
//       onUpdate(updatedWork); // שליחה לאב לעדכון
//       onClose(); // סגירת הדיאלוג לאחר עדכון
//     } else {
//       alert("אנא מלא את כל השדות.");
//     }
//   };

//   return (
//     <Dialog open={open} onClose={onClose}>
//       <DialogTitle>עדכון עבודה</DialogTitle>
//       <DialogContent>
//         <TextField
//           label="תאריך"
//           value={updatedWork.date || ""}
//           onChange={(e) => setUpdatedWork({ ...updatedWork, date: e.target.value })}
//           fullWidth
//           margin="normal"
//           type="date"
//           InputLabelProps={{ shrink: true }}
//         />
//         <TextField
//           label="כמות"
//           value={updatedWork.work_quantity || ""}
//           onChange={(e) => setUpdatedWork({ ...updatedWork, work_quantity: e.target.value })}
//           fullWidth
//           margin="normal"
//           type="number"
//         />
//         <TextField
//           label="תאור"
//           value={updatedWork.description || ""}
//           onChange={(e) => setUpdatedWork({ ...updatedWork, description: e.target.value })}
//           fullWidth
//           margin="normal"
//         />
//         <TextField
//           label="הערות"
//           value={updatedWork.notes || ""}
//           onChange={(e) => setUpdatedWork({ ...updatedWork, notes: e.target.value })}
//           fullWidth
//           margin="normal"
//         />
//       </DialogContent>
//       <DialogActions>
//         <Button onClick={onClose} color="secondary">ביטול</Button>
//         <Button onClick={handleSave} color="primary">שמור שינויים</Button>
//       </DialogActions>
//     </Dialog>
//   );
// };

// export default UpdateWorkDialog;


import React, { useState, useEffect } from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button } from "@mui/material";

const UpdateWorkDialog = ({ open, onClose, workData, onUpdate }) => {
  const [updatedWork, setUpdatedWork] = useState({
    id_work_logs: "", // אתחול ה-ID של העבודה
    date: "", // אתחול התאריך
    work_quantity: "",
    description: "",
    notes: "",
  });

  // אם workData משתנה, נעשה עדכון ל-state
  useEffect(() => {
    if (workData) {
      // המרת התאריך לפורמט YYYY-MM-DD
      const localDate = workData.date ? new Date(workData.date).toLocaleDateString("en-CA") : ""; // "en-CA" מבטיח פורמט YYYY-MM-DD
      setUpdatedWork({
        id_work_logs: workData.id_work_logs, // עדכון ה-ID
        date: localDate, // שימוש בתאריך המקומי
        work_quantity: workData.work_quantity || "",
        description: workData.description || "",
        notes: workData.notes || "",
      });
    }
  }, [workData]);
  
  const handleSave = () => {
    if (updatedWork.date && updatedWork.work_quantity && updatedWork.description) {
      onUpdate(updatedWork); // שליחה לאב לעדכון
      onClose(); // סגירת הדיאלוג לאחר עדכון
    } else {
      alert("אנא מלא את כל השדות.");
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>עדכון עבודה</DialogTitle>
      <DialogContent>
        <TextField
          label="תאריך"
          value={updatedWork.date || ""}
          onChange={(e) => setUpdatedWork({ ...updatedWork, date: e.target.value })}
          fullWidth
          margin="normal"
          type="date"
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="כמות"
          value={updatedWork.work_quantity || ""}
          onChange={(e) => setUpdatedWork({ ...updatedWork, work_quantity: e.target.value })}
          fullWidth
          margin="normal"
          type="number"
        />
        <TextField
          label="תאור"
          value={updatedWork.description || ""}
          onChange={(e) => setUpdatedWork({ ...updatedWork, description: e.target.value })}
          fullWidth
          margin="normal"
        />
        <TextField
          label="הערות"
          value={updatedWork.notes || ""}
          onChange={(e) => setUpdatedWork({ ...updatedWork, notes: e.target.value })}
          fullWidth
          margin="normal"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">ביטול</Button>
        <Button onClick={handleSave} color="primary">שמור שינויים</Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpdateWorkDialog;

