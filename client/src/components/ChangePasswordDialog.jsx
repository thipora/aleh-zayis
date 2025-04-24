// import {
//     Dialog, DialogTitle, DialogContent, DialogActions,
//     Button, TextField, IconButton, InputAdornment
//   } from "@mui/material";
//   import { useState } from "react";
//   import Visibility from "@mui/icons-material/Visibility";
//   import VisibilityOff from "@mui/icons-material/VisibilityOff";
//   import { APIrequests } from "../APIrequests";
  
//   const ChangePasswordDialog = ({ open, onClose, userId }) => {
//     const [form, setForm] = useState({
//       currentPassword: '',
//       newPassword: '',
//       confirmPassword: ''
//     });
//     const [error, setError] = useState('');
//     const [success, setSuccess] = useState('');
//     const [showPassword, setShowPassword] = useState(false);
//     const api = new APIrequests();
  
//     const handleChange = (e) => {
//       setForm({ ...form, [e.target.name]: e.target.value });
//     };
  
//     const handleTogglePassword = () => {
//       setShowPassword(prev => !prev);
//     };
  
//     const handleSubmit = async () => {
//       setError('');
//       setSuccess('');
//       try {
//         await api.postRequest("/auth/change-password", {
//           userId,
//           currentPassword: form.currentPassword,
//           newPassword: form.newPassword,
//           confirmPassword: form.confirmPassword
//         });
//         setSuccess("Password updated!");
//         setTimeout(onClose, 1500);
//       } catch (err) {
//         setError(err.response?.data?.message || "Something went wrong");
//       }
//     };
  
//     return (
//       <Dialog open={open} onClose={onClose}>
//         <DialogTitle>Change Password</DialogTitle>
//         <DialogContent>
//           <TextField
//             fullWidth
//             label="Current Password"
//             name="currentPassword"
//             type={showPassword ? "text" : "password"}
//             value={form.currentPassword}
//             onChange={handleChange}
//             margin="normal"
//             InputProps={{
//               endAdornment: (
//                 <InputAdornment position="end">
//                   <IconButton onClick={handleTogglePassword}>
//                     {showPassword ? <VisibilityOff /> : <Visibility />}
//                   </IconButton>
//                 </InputAdornment>
//               )
//             }}
//           />
//           <TextField
//             fullWidth
//             label="New Password"
//             name="newPassword"
//             type={showPassword ? "text" : "password"}
//             value={form.newPassword}
//             onChange={handleChange}
//             margin="normal"
//           />
//           <TextField
//             fullWidth
//             label="Confirm Password"
//             name="confirmPassword"
//             type={showPassword ? "text" : "password"}
//             value={form.confirmPassword}
//             onChange={handleChange}
//             margin="normal"
//           />
//           {error && <p style={{ color: "red" }}>{error}</p>}
//           {success && <p style={{ color: "green" }}>{success}</p>}
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={onClose}>Cancel</Button>
//           <Button onClick={handleSubmit} variant="contained" color="primary">Save</Button>
//         </DialogActions>
//       </Dialog>
//     );
//   };
  
//   export default ChangePasswordDialog;
  