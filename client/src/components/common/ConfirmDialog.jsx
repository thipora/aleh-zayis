// import React from "react";
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Typography,
//   Button
// } from "@mui/material";

// const ConfirmDialog = ({ open, onClose, onConfirm, title, content }) => {
//   return (
//     <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
//       {title && (
//         <DialogTitle sx={{ textAlign: "center", fontWeight: "bold" }}>
//           {title}
//         </DialogTitle>
//       )}
//       {content && (
//         <DialogContent>
//           <Typography align="center">{content}</Typography>
//         </DialogContent>
//       )}
//       <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
//         <Button onClick={onClose} variant="outlined" color="secondary">
//           ביטול
//         </Button>
//         <Button onClick={onConfirm} variant="contained" color="error">
//           אישור
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// };

// export default ConfirmDialog;
import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button
} from "@mui/material";
import { useTranslation } from "react-i18next";

const ConfirmDialog = ({ open, onClose, onConfirm, title, content }) => {
  const { t } = useTranslation();

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      {title && (
        <DialogTitle sx={{ textAlign: "center", fontWeight: "bold" }}>
          {title}
        </DialogTitle>
      )}
      {content && (
        <DialogContent>
          <Typography align="center">{content}</Typography>
        </DialogContent>
      )}
      <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
        <Button onClick={onClose} variant="outlined" color="secondary">
          {t("common.cancel")}
        </Button>
        <Button onClick={onConfirm} variant="contained" color="error">
          {t("common.confirm")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
