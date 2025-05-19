import React, { useState } from "react";
import { Container, TextField, Button, Typography, Box, Dialog, DialogTitle, DialogContent, DialogActions, InputAdornment, IconButton} from "@mui/material";
import { APIrequests } from "../../APIrequests";
import { useNavigate } from "react-router-dom";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

const ChangePassword = ({ onClose }) => {
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState("");
  const [touched, setTouched] = useState({
    // email: false,
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });
  const apiRequests = new APIrequests();
  const navigate = useNavigate();

  const errors = {
    email: !email && touched.email ? "Email is required" : "",
    currentPassword: !currentPassword && touched.currentPassword ? "Current password is required" : "",
    newPassword: !newPassword && touched.newPassword
      ? "New password is required"
      : newPassword.length > 0 && newPassword.length < 6
        ? "Password must be at least 6 characters"
        : "",
    confirmPassword:
      !confirmPassword && touched.confirmPassword
        ? "Please confirm your new password"
        : confirmPassword.length > 0 && newPassword !== confirmPassword
          ? "Passwords do not match"
          : "",
  };

  const hasError = Object.values(errors).some((msg) => !!msg)
    // || !email
    || !currentPassword
    || !newPassword
    || !confirmPassword
    || newPassword.length < 6
    || newPassword !== confirmPassword;

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setServerError("");
  //   setTouched({
  //     email: true,
  //     currentPassword: true,
  //     newPassword: true,
  //     confirmPassword: true,
  //   });

  //   if (hasError) return;

  //   try {

  //     const user = JSON.parse(localStorage.getItem("user") || "{}");

  //     await apiRequests.postRequest("/auth/change-password", {
  //       // email,
  //       userId: user.id_user,
  //       currentPassword,
  //       newPassword,
  //     });
  //     setSuccess(true);
  //   } catch (err) {
  //     setServerError("Failed to change password. Please try again.");
  //   }
  // };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setServerError("");
  setTouched({
    currentPassword: true,
    newPassword: true,
    confirmPassword: true,
  });

  if (hasError) return;

  try {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    await apiRequests.putRequest("/auth/change-password", {
      userId: user.id_user,
      currentPassword,
      newPassword,
    });

    setSuccess(true);

    // אחרי 2 שניות – סגירת הדיאלוג (אם יש prop)
    setTimeout(() => {
      if (typeof onClose === "function") {
        onClose();
      }
    }, 2000);
  } catch (err) {
    setServerError("Failed to change password. Please try again.");
  }
};

  // const SuccessDialog = () => (
  //   <Dialog open={success} onClose={() => navigate("/login")}>
  //     <DialogTitle>Password Changed</DialogTitle>
  //     <DialogContent>
  //       <Typography>
  //         Your password has been changed successfully.<br />
  //         You can now log in with your new password.
  //       </Typography>
  //     </DialogContent>
  //     <DialogActions>
  //       <Button
  //         variant="contained"
  //         color="primary"
  //         onClick={() => navigate("/login")}
  //       >
  //         Go to Login
  //       </Button>
  //     </DialogActions>
  //   </Dialog>
  // );

  return (
    // <Container component="main" maxWidth="xs">
      <Box sx={{ p: 3, mt: 2, mb: 2, width: '100%' }}>
{success && (
  <Typography color="success.main" sx={{ mb: 2 }}>
    הסיסמה עודכנה בהצלחה!
  </Typography>
)}



      {/* <SuccessDialog /> */}
      {/* <Box sx={{
        display: "flex", flexDirection: "column", alignItems: "center", padding: 3, boxShadow: 3, borderRadius: 2
      }}> */}
        {/* <Button
          variant="text"
          onClick={() => navigate(-1)}
          sx={{ alignSelf: "flex-start", mb: 1 }}
        >
          ← Back
        </Button> */}
        <Typography variant="h5" gutterBottom>
          Change Password
        </Typography>
        {serverError && (
          <Typography color="error" sx={{ mb: 2 }}>
            {serverError}
          </Typography>
        )}
        <form onSubmit={handleSubmit} style={{ width: "100%" }} noValidate>
          {/* <TextField
            fullWidth
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
            required
            error={!!errors.email}
            helperText={errors.email}
            onBlur={() => handleBlur("email")}
            autoComplete="email"
          /> */}
          <TextField
            fullWidth
            label="Current Password"
            type={showCurrent ? "text" : "password"}
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            margin="normal"
            required
            error={!!errors.currentPassword}
            helperText={errors.currentPassword}
            onBlur={() => handleBlur("currentPassword")}
            autoComplete="current-password"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowCurrent((prev) => !prev)}
                    edge="end"
                  >
                    {showCurrent ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            fullWidth
            label="New Password"
            type={showNew ? "text" : "password"}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            margin="normal"
            required
            error={!!errors.newPassword}
            helperText={errors.newPassword}
            onBlur={() => handleBlur("newPassword")}
            autoComplete="new-password"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowNew((prev) => !prev)}
                    edge="end"
                  >
                    {showNew ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            fullWidth
            label="Confirm New Password"
            type={showConfirm ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            margin="normal"
            required
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword}
            onBlur={() => handleBlur("confirmPassword")}
            autoComplete="new-password"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowConfirm((prev) => !prev)}
                    edge="end"
                  >
                    {showConfirm ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mt: 2 }}
          >
            Change Password
          </Button>
        </form>
      </Box>
  );
};

export default ChangePassword;
